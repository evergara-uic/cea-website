/*
 * Build the web-ready logo assets from the College's originals in logos/.
 *
 *     node scripts/build-logo-assets.mjs
 *
 * Runs as part of `npm run build`, before astro, and is idempotent: it only
 * writes a file when the bytes would actually change, so a normal rebuild
 * touches nothing.
 *
 * Why these are processed at all, and why they are NOT vectorised:
 *
 * The four programme marks render at 56 CSS pixels inside an 80-pixel circle
 * (size-20 with p-3), so 112 device pixels on a 2x display and 168 on a 3x one.
 * The originals are 1563 to 2750 pixels square. Serving them unchanged spends
 * up to 4.2 MB to draw a circle smaller than a fingernail. 256px leaves
 * comfortable headroom over the largest plausible render and turns the whole
 * set into a few tens of kilobytes.
 *
 * The tempting alternative, tracing these to SVG, was measured and rejected.
 * Rendering each trace back to a raster and diffing it against its own source
 * gives a mean absolute error per pixel, out of 255:
 *
 *     electronics   1.2    32 distinct colours, saturation 0.000  — line art
 *     cea          22.1   135 colours, two-tone brand palette
 *     architecture 37.9   456 colours, 43% mid-tone
 *     civil        44.2   2266 colours, no alpha
 *     icpepse      47.8   4148 colours
 *
 * Only the electronics mark is flat line art, and it is kept as a raster anyway
 * so all four marks are encoded the same way. The rest are tonal or
 * photographic: Potrace has to invent the greys, and half the pixels come out
 * substantially wrong. A traced photograph is a cartoon of the College's own
 * mark, which is not a trade worth making for a file extension.
 *
 * The originals stay in logos/, outside public/, so they are versioned as the
 * source of truth but never deployed. The vector originals are still worth
 * asking the College for; when they arrive, this script is the only thing that
 * has to change.
 */
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Output directory. Imported by the components, so Astro fingerprints it. */
const OUT = 'src/assets/logos';

/**
 * The bounding box of everything not fully transparent.
 *
 * Used to crop away empty margin. It is a crop, not a rescale: nothing about
 * the artwork's proportions changes, only the amount of transparent padding
 * around it. That matters because the four sources pad very differently — the
 * architecture mark's ink starts 6% in and stops at 84%, so a fifth of its
 * canvas is empty, while the Civil mark is edge to edge. Left alone, the padded
 * marks render visibly smaller than the unpadded ones inside the same circle.
 */
async function alphaBox(path) {
	const meta = await sharp(path).metadata();
	if (!meta.hasAlpha) return null;
	const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	const { width: w, height: h, channels: c } = info;
	let left = w;
	let top = h;
	let right = -1;
	let bottom = -1;
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			if (data[(y * w + x) * c + 3] > 8) {
				if (x < left) left = x;
				if (x > right) right = x;
				if (y < top) top = y;
				if (y > bottom) bottom = y;
			}
		}
	}
	return right < 0 ? null : { left, top, width: right - left + 1, height: bottom - top + 1 };
}

const JOBS = [
	{ src: 'architect_logo.png', out: 'architecture.webp', width: 256 },
	{ src: 'civilEngineer_logo.webp', out: 'civil.webp', width: 256 },
	{ src: 'ICPEP.SE_logo.png', out: 'computer.webp', width: 256 },
	{ src: 'electronics_engineering_logo.png', out: 'electronics.webp', width: 256 },
	// The College's own lockup, shown at hero size on the seal page.
	{ src: 'CEA logo.png', out: 'cea.webp', width: 1024 },
];

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;

const write = async (path, buffer) => {
	try {
		if ((await readFile(path)).equals(buffer)) return false;
	} catch {
		/* absent, so it is a new file */
	}
	await writeFile(path, buffer);
	return true;
};

await mkdir(OUT, { recursive: true });

let beforeTotal = 0;
let afterTotal = 0;

for (const job of JOBS) {
	const from = join('logos', job.src);
	const to = join(OUT, job.out);

	const box = await alphaBox(from);
	let pipeline = sharp(from);
	if (box) pipeline = pipeline.extract(box);

	const before = (await readFile(from)).length;
	const buffer = await pipeline
		.resize({ width: job.width, fit: 'inside', withoutEnlargement: false })
		.webp({ quality: 86, effort: 6 })
		.toBuffer();
	const changed = await write(to, buffer);
	beforeTotal += before;
	afterTotal += buffer.length;

	const meta = await sharp(to).metadata();
	const cropped = box ? `  cropped ${box.width}x${box.height}` : '  no alpha channel';
	console.log(
		`${job.out.padEnd(20)} ${kb(before).padStart(8)} -> ${kb(buffer.length).padStart(6)}  ` +
			`${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ` +
			`alpha=${String(meta.hasAlpha).padEnd(5)} ${cropped}${changed ? '' : ' (unchanged)'}`,
	);
}

console.log(
	`${'total'.padEnd(20)} ${kb(beforeTotal).padStart(8)} -> ${kb(afterTotal).padStart(6)}  ` +
		`${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller`,
);

