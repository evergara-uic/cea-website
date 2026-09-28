/**
 * Delete anything under dist/_astro that the build emitted but nothing renders.
 *
 * Astro emits the original file for every image it imports, because the
 * ImageMetadata `src` has to resolve to something. That is necessary at build
 * time but wasteful in the output: when the site carried 125 local photographs
 * it meant tens of megabytes of full-size JPEGs sitting in dist next to the WebP
 * renditions the pages actually used.
 *
 * The site now emits its local media deliberately: the College's 135
 * photographs at two widths each, four videos and four poster frames under
 * _astro, all referenced from the Events page. So there is now something to
 * prune, and the log line is worth reading — "pruned 0" means every emitted
 * asset is used, which is the state this build is in.
 *
 * The reason the script stays dangerous enough to be worth its comments is
 * that it reads markup rather than the build graph. It once deleted four
 * poster frames because it only knew about `src` and `href`, and both
 * verifiers passed on a build where every video was a black box. The script is
 * deliberately conservative:
 *
 *   - only files under _astro are ever considered for deletion
 *   - references are gathered from every text file in the build, not just
 *     HTML, because stylesheets and scripts reference fonts and images too
 *   - a file referenced from anywhere is kept
 *   - nothing is deleted if the reference set looks wrong, so a build problem
 *     fails loudly instead of shipping a site with missing assets
 *
 * Run after astro build:  node scripts/prune-unused-assets.mjs
 */

import { readFile, readdir, rm, stat } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const DIST = resolve(process.argv[2] ?? 'dist');
const ASSET_DIR = join(DIST, '_astro');

/** Every file under a directory, recursively. A missing directory is empty. */
async function allFiles(dir) {
	const found = [];
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch (error) {
		// ENOENT only. Anything else is a real problem and propagates.
		if (error.code === 'ENOENT') return found;
		throw error;
	}
	for (const entry of entries) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) found.push(...(await allFiles(path)));
		else found.push(path);
	}
	return found;
}

/*
 * Files that can contain a reference. Binary assets are excluded: reading them
 * as text is wasted work and could not produce a meaningful match anyway.
 */
const SCANNED = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.webmanifest', '.map']);

const everyFile = await allFiles(DIST);
const pages = everyFile.filter((path) => path.endsWith('.html'));
const sources = everyFile.filter((path) => SCANNED.has(path.slice(path.lastIndexOf('.'))));

/*
 * A build with no HTML, or with no references at all, means something upstream
 * went wrong. Deleting assets on that evidence would turn a recoverable build
 * error into a site full of broken images and missing fonts.
 */
const referenced = new Set();
for (const source of sources) {
	const text = await readFile(source, 'utf8');

	/*
	 * Any attribute whose value is a site-absolute path.
	 *
	 * This started life as a list of `src` and `href`, and that list was a
	 * trap: it did not know about `<video poster>`, so it deleted all four
	 * poster frames and every video rendered as a black box. A build that
	 * passes both verifiers said nothing was wrong. Matching any quoted
	 * attribute value that begins with a slash catches `src`, `href`, `poster`,
	 * `data-src` and anything added later, so a new attribute never again
	 * needs this script edited before it starts deleting files that are in use.
	 * The `_astro` filter further down drops the page links it also collects.
	 */
	for (const match of text.matchAll(/=["'`](\/[^"'`]+)["'`]/g)) {
		referenced.add(match[1].split(/[?#]/)[0]);
	}
	for (const match of text.matchAll(/url\(\s*['"]?(\/[^)'"]+)['"]?\s*\)/g)) {
		referenced.add(match[1].split(/[?#]/)[0]);
	}
	// srcset is a comma-separated list of "url size" pairs.
	for (const match of text.matchAll(/srcset="([^"]+)"/g)) {
		for (const part of match[1].split(',')) {
			referenced.add(part.trim().split(/\s+/)[0].split(/[?#]/)[0]);
		}
	}
}

const keep = new Set(
	[...referenced].filter((url) => url.startsWith('/_astro/')).map((url) => url.slice(1)),
);

if (pages.length === 0 || keep.size === 0) {
	console.error(
		`refusing to prune: found ${pages.length} pages and ${keep.size} referenced assets.`,
	);
	process.exit(1);
}

let removed = 0;
let kept = 0;
let freed = 0;

for (const path of await allFiles(ASSET_DIR)) {
	const { size } = await stat(path);
	if (keep.has(relative(DIST, path).split(sep).join('/'))) {
		kept += 1;
		continue;
	}
	await rm(path);
	removed += 1;
	freed += size;
}

console.log(
	`pruned ${removed} unreferenced asset(s) (${(freed / 1e6).toFixed(1)} MB), kept ${kept}`,
);
