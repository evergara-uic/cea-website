/**
 * Prepare the department marks for the site.
 *   node scripts/prepare-logos.mjs
 *
 * The sources are 2750x2750 and 1563x1563 seals with fine detail — 20 MB for
 * three files, far too heavy for marks that render at 100-200px. They are
 * reduced to a size that is still 3x the largest display box.
 *
 * One source (civilEngineer_logo.webp) has no alpha channel and carries a
 * baked-in white background, so every mark is flattened onto white here and
 * every mark is displayed on a white plate. That keeps the two kinds of source
 * looking identical, and stops the opaque one showing a white rectangle in
 * dark mode.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = '.tmp-logo';
const OUT = 'public/logos';
const SIZE = 512;

// Marks attributed to a department by the filename the College itself used in
// the export's Logos/ folder, cross-checked against the order of the four
// images on the live programmes page.
const JOBS = [
	{ file: 'architect_logo.png', out: 'architecture.png', label: 'Architecture' },
	{ file: 'civilEngineer_logo.webp', out: 'civil-engineering.png', label: 'Civil Engineering' },
	{ file: 'electronics_engineering_logo.png', out: 'electronics-engineering.png', label: 'Electronics Engineering' },
	{ file: 'ICPEP.SE_logo.png', out: 'computer-engineering.png', label: 'Computer Engineering' },
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
	const from = path.join(SRC, job.file);
	const before = await sharp(from).metadata();

	const buf = await sharp(from)
		.flatten({ background: '#ffffff' })
		.trim({ threshold: 6 })
		.resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
		.png({ compressionLevel: 9, effort: 10 })
		.toBuffer();

	await sharp(buf).toFile(path.join(OUT, job.out));
	const after = await sharp(buf).metadata();
	const kb = Math.round(buf.length / 1024);

	console.log(
		`${job.label.padEnd(20)} ${String(before.width + 'x' + before.height).padEnd(11)} -> ` +
			`${String(after.width + 'x' + after.height).padEnd(11)} alpha=${before.hasAlpha ? 'y' : 'n'}  ${kb}KB`,
	);
}
