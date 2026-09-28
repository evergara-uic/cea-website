/**
 * Cross-reference the Google Sites Takeout export against the images already
 * migrated from the live site.
 *
 * The two sources use incompatible names: the export calls its files
 * "unnamed (3).png", while the live site only exposes rotating CDN ids, so the
 * first migration had to name files by position. To combine the best of both --
 * the export's real folder structure, and the live site's known ordering -- we
 * need to know which export file is which already-migrated file.
 *
 * Filenames cannot answer that, and neither can byte hashes, because the export
 * holds originals while the site served resized copies. A coarse grayscale
 * thumbnail can: it is insensitive to resolution and re-encoding but still
 * sensitive to the actual picture.
 *
 * Run inside the dev pod, where sharp is installed:
 *   node scripts/match-assets.mjs
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import sharp from 'sharp';

const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const TAKEOUT = join(REPO, '.staging', 'takeout');
const GALLERY = join(REPO, 'src', 'assets', 'gallery');

const SIZE = 16; // px, square grayscale thumbnail
const BINS = SIZE * SIZE;

async function* walk(dir) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(path);
		else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) yield path;
	}
}

/**
 * A thumbnail reduced to a length-normalised vector, so that a uniformly
 * brighter or darker copy of the same photo still lands close.
 */
async function signature(path) {
	const { data } = await sharp(path)
		.resize(SIZE, SIZE, { fit: 'fill' })
		.removeAlpha()
		.greyscale()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const out = new Float32Array(BINS);
	let sum = 0;
	for (let i = 0; i < BINS; i += 1) {
		out[i] = data[i];
		sum += data[i];
	}
	const mean = sum / BINS;
	let variance = 0;
	for (let i = 0; i < BINS; i += 1) variance += (out[i] - mean) ** 2;
	const norm = Math.sqrt(variance) || 1;
	for (let i = 0; i < BINS; i += 1) out[i] = (out[i] - mean) / norm;
	return out;
}

/** Cosine similarity of two unit-variance vectors; 1 is identical, 0 unrelated. */
function similarity(a, b) {
	let dot = 0;
	for (let i = 0; i < BINS; i += 1) dot += a[i] * b[i];
	// Both vectors already have unit length, so the dot product *is* the cosine.
	return dot;
}

async function loadAll(dir) {
	const files = [];
	for await (const path of walk(dir)) {
		try {
			files.push({ path, key: relative(dir, path), sig: await signature(path) });
		} catch {
			// An unreadable or corrupt file is not worth failing the report over.
		}
	}
	return files;
}

const takeout = await loadAll(TAKEOUT);
const gallery = await loadAll(GALLERY);

console.log(`takeout: ${takeout.length} images, migrated: ${gallery.length} images\n`);

// For each already-migrated image, report its closest counterpart in the
// export. The one-way direction matters: every faculty portrait must be found
// in the export, but the export also holds images the migrated set never saw.
const rows = [];
for (const mine of gallery) {
	let best = { score: -1, key: null };
	for (const theirs of takeout) {
		const score = similarity(mine.sig, theirs.sig);
		if (score > best.score) best = { score, key: theirs.key };
	}
	rows.push({ mine: mine.key, ...best });
}

rows.sort((a, b) => a.score - b.score);

console.log('migrated file  ->  closest export file            similarity');
for (const row of rows) {
	const flag = row.score > 0.9 ? '' : row.score > 0.75 ? '  (weak)' : '  -- no match';
	console.log(
		`${row.mine.padEnd(42)} ${String(row.key).padEnd(38)} ${row.score.toFixed(3)}${flag}`,
	);
}

// Export files nothing in the migrated set resembles: these are the photos the
// rate-limited first pass never managed to download.
const claimed = new Set(rows.filter((r) => r.score > 0.75).map((r) => r.key));
const orphans = takeout.filter((t) => !claimed.has(t.key));
console.log(`\nexport files with no counterpart among the migrated set: ${orphans.length}`);
const byFolder = {};
for (const orphan of orphans) {
	const folder = orphan.key.split(sep).slice(0, -1).join('/') || '(root)';
	byFolder[folder] = (byFolder[folder] ?? 0) + 1;
}
for (const [folder, count] of Object.entries(byFolder).sort((a, b) => b[1] - a[1])) {
	console.log(`  ${String(count).padStart(4)}  ${folder}`);
}
