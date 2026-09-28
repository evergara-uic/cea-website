/*
 * Build the faculty portraits from the College's originals in faculties/.
 *
 *     node scripts/build-faculty-portraits.mjs
 *
 * Runs as part of `npm run build`, before astro, alongside the logo script, and
 * is idempotent: it only writes a file when the bytes would actually change.
 *
 * The portraits were the last of the site's generated images with no
 * replacement available. Sixteen supplied photographs now stand in for two
 * generated ones, which had been doing the work of sixteen: the design had an
 * invented portrait of a dean and an invented portrait of a coordinator, and
 * every other member of the faculty got a drafting-board monogram in its
 * place. That meant fourteen real faculty were represented on the site by an
 * icon while two fictional people stood in for the roles.
 *
 * These render at 64 CSS pixels inside the card's `size-16` frame, so 128
 * device pixels on a 2x display and 192 on a 3x one. The originals are 1024 and
 * 1125 pixels square, and 15 MB for the set. 256px leaves the same comfortable
 * headroom the logos use and turns the whole set into a few tens of kilobytes.
 *
 * Why 256 and not 512: this is the second time on this site that the answer
 * followed from measuring where an image actually lands rather than from a
 * round number. The 116 dead font classes and the 4,274 KB architecture logo
 * were both cases of a size nobody had checked.
 *
 * `portrait` in src/content/faculty.json is the key each of these is stored
 * under, and it is the same value as the entry's `id`. The mapping below is
 * written out rather than derived, because the supplied filenames are in
 * upper case, carry post-nominals, and spell names differently from the roster
 * in at least one place — the roster calls Engr. Emmanuel Jr E. Vergara simply
 * "vergara", and the file spells his forename out. Slugifying both sides and
 * hoping they meet would work for fifteen of sixteen and fail quietly on the
 * sixteenth, which is the worst way for this to fail.
 */
import sharp from 'sharp';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Output directory. Imported by FacultyCard, so Astro fingerprints it. */
const OUT = 'src/assets/faculty';

/** Device-pixel headroom over the 64px render, matching the logo script. */
const WIDTH = 256;

/**
 * roster id -> supplied filename.
 *
 * One to one: sixteen entries, sixteen photographs, the Dean appearing once
 * because the roster has one entry for her. Every file is checked at build
 * time. A missing file is a hard error, not a skipped row: a faculty member
 * silently losing their photograph because a filename was refactored is the
 * failure mode this mapping exists to prevent.
 */
const JOBS = {
	// The Office of the Dean. The Dean is also the Program Coordinator of
	// Computer Engineering; the roster lists her once, here, and the Computer
	// Engineering section borrows the same card.
	dean: 'ENGR. JUVIE PAULINE L. RELACION, PCPE, MEng-CpE.png',
	vitor: 'TRESHIA LORAINE T. VITOR.png',

	// Architecture.
	santos: 'AR. LEONIDA D. SANTOS.png',
	clave: 'AR. JACOB G. CLAVE.png',
	bermudez: 'AR. MARCO ANTONIO G. BERMUDEZ.png',
	tanglao: 'AR. RAMON D. TANGLAO.png',

	// Civil Engineering.
	ngo: 'ENGR. PETER ADRIAN T. NGO, CE.png',
	fuentes: 'ENGR. EMMA CONCEPCION M. FUENTES, CE.png',
	quino: 'ENGR. JOHNDEL V. QUIÑO, CE.png',
	alacaba: 'ENGR. EDDIE VIC S. ALACABA, PCPE, MEng-CpE.png',

	// Computer Engineering.
	vergara: 'ENGR. EMMANUEL JR E. VERGARA.png',

	// Electronics Engineering.
	quinamot: 'ENGR. SHIELA MAE V. QUINAMOT, ECE.png',
	tampus: 'ENGR. RHENAN G. TAMPUS, ECE, ECT.png',
	moso: 'ENGR. RAYMUNDO S. MOSO, ECE, MAEE.png',
	sombilla: 'ENGR. AYLMER RONNEL L. SOMBILLA, ECE, MEng-ECE.png',
	aborde: 'ENGR. MEL CHRISTIAN V. ABORDE, ECE.png',
};

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

/* Fail before writing anything if a supplied file is not where it should be. */
const supplied = new Set(await readdir('faculties'));
const missing = Object.entries(JOBS)
	.filter(([, file]) => !supplied.has(file))
	.map(([id, file]) => `${id} -> ${file}`);
if (missing.length) {
	console.error(`faculties/ is missing ${missing.length} expected file(s):`);
	for (const line of missing) console.error(`  ${line}`);
	process.exit(1);
}

let beforeTotal = 0;
let afterTotal = 0;
let changed = 0;

for (const [id, file] of Object.entries(JOBS)) {
	const from = join('faculties', file);
	const to = join(OUT, `${id}.webp`);

	const before = (await readFile(from)).length;
	const buffer = await sharp(from)
		.resize({ width: WIDTH, fit: 'cover', position: 'top' })
		.webp({ quality: 86, effort: 6 })
		.toBuffer();
	const wrote = await write(to, buffer);
	beforeTotal += before;
	afterTotal += buffer.length;
	if (wrote) changed += 1;

	const meta = await sharp(to).metadata();
	console.log(
		`${id.padEnd(10)} ${kb(before).padStart(8)} -> ${kb(buffer.length).padStart(6)}  ` +
			`${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}${wrote ? '' : ' (unchanged)'}`,
	);
}

console.log(
	`${'total'.padEnd(10)} ${kb(beforeTotal).padStart(8)} -> ${kb(afterTotal).padStart(6)}  ` +
		`${Math.round((1 - afterTotal / beforeTotal) * 100)}% smaller, ${changed} file(s) written`,
);
