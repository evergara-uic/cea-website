/**
 * Web-encode the exported videos and cut a poster frame from each.
 *
 *   node scripts/encode-video.mjs
 *
 * The export is camera/capture footage: 1080p at 59.94fps and ~10 Mbps, which
 * is far more than a browser needs. Frame rate is capped at 30 and the bitrate
 * is driven by CRF, which is what actually shrinks these. Everything lands in
 * public/media/video/ so Astro copies it verbatim instead of fingerprinting
 * large binaries.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, readdirSync, renameSync, rmSync } from 'node:fs';
import path from 'node:path';

const SRC = '.tmp-video';
const OUT = 'public/media/video';

// export filename -> site slug, and the height to land on.
// 900 keeps the 1080p sources crisp on a desktop without the 1080p bitrate.
const JOBS = [
	{ file: 'CEA Promotional Video.mp4', slug: 'cea-promotional', height: 720 },
	{ file: 'EA PROGRAM - AVP [fixed].mp4', slug: 'uni-fair-2026', height: 900 },
	{ file: 'cea fair.mp4', slug: 'seminars-and-field-trips', height: 900 },
	{ file: 'ceafairfullvid.mp4', slug: 'seminars-and-field-trips-full', height: 900 },
];

// Cloudflare Pages asks for files under 25 MB. Re-encode anything over.
const CEILING = 25 * 1024 * 1024;

const run = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);

const probe = (file) =>
	JSON.parse(
		execFileSync('ffprobe', [
			'-v', 'error',
			'-show_entries', 'format=duration',
			'-of', 'json',
			file,
		]).toString(),
	);

mkdirSync(OUT, { recursive: true });

/** Pick the most detailed of several sample frames, so the poster is not a fade or a blank. */
function poster(src, duration, target) {
	const tmp = path.join(OUT, `${target}-poster-candidate.jpg`);
	let best = -1;
	let bestSd = -1;
	for (const pct of [0.08, 0.18, 0.32, 0.5, 0.72]) {
		run([
			'-ss', (duration * pct).toFixed(2),
			'-i', src,
			'-frames:v', '1',
			'-vf', 'scale=1280:-2,format=yuvj420p',
			'-q:v', '3',
			tmp,
		]);
		// Crude detail score: file size of a fixed-quality JPEG rises with detail.
		const score = statSync(tmp).size;
		if (score > bestSd) {
			bestSd = score;
			best = pct;
		}
	}
	rmSync(tmp, { force: true });
	run([
		'-ss', (duration * best).toFixed(2),
		'-i', src,
		'-frames:v', '1',
		'-vf', 'scale=1280:-2',
		'-q:v', '4',
		path.join(OUT, `${target}-poster.jpg`),
	]);
	return best;
}

for (const job of JOBS) {
	const src = path.join(SRC, job.file);
	if (!readdirSync(SRC).includes(job.file)) {
		console.log(`MISSING  ${job.file}`);
		continue;
	}
	const duration = Number(probe(src).format.duration);
	const inBytes = statSync(src).size;

	let crf = 27;
	let out = path.join(OUT, `${job.slug}.mp4`);
	const encode = (c) =>
		run([
			'-i', src,
			'-vf', `fps=30,scale=-2:${job.height}:flags=lanczos`,
			'-c:v', 'libx264',
			'-profile:v', 'high',
			'-preset', 'medium',
			'-crf', String(c),
			'-pix_fmt', 'yuv420p',
			// Keyframe every 2s so seeking and progressive start stay responsive.
			'-g', '60',
			'-c:a', 'aac',
			'-b:a', '96k',
			'-ac', '2',
			'-movflags', '+faststart',
			out,
		]);

	for (let attempt = 0; attempt < 3; attempt++) {
		encode(crf);
		const bytes = statSync(out).size;
		console.log(
			`${job.slug.padEnd(30)} crf ${crf}  ${(bytes / 1048576).toFixed(1)}MB  ` +
				`(${inBytes / 1048576 >= 1 ? (inBytes / 1048576).toFixed(0) + 'MB' : (inBytes / 1024).toFixed(0) + 'KB'} source)`,
		);
		if (bytes <= CEILING) break;
		crf += 3;
	}

	const at = poster(src, duration, job.slug);
	console.log(`${' '.repeat(30)} poster from ${(at * 100).toFixed(0)}% of ${duration.toFixed(0)}s`);
}
