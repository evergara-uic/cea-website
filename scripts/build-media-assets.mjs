/*
 * Build the web-ready event media from the originals in media/source/.
 *
 *     npm run media            photos only; videos are skipped without ffmpeg
 *     npm run media -- --video also transcode the video
 *     FFMPEG=/path/to/ffmpeg npm run media -- --video
 *
 * NOT part of `npm run build`. Transcoding 570 MB of source takes several
 * minutes, and Cloudflare Pages times a build out at 20 minutes. The output is
 * committed instead, so CI never needs ffmpeg and never does this work. The
 * logo script does run at build time, because it handles five files and about a
 * second of work.
 *
 * Videos: Cloudflare Pages rejects any single asset over 25 MiB, so these are
 * not optional. All four supplied files exceeded it, by 27.8 to 166.6 MB, and
 * the deploy failed on that before anything else could be diagnosed.
 *
 *   file                    was              now     why it was so big
 *   CEA Promotional Video   720p30  1.1 Mb/s 27.8 MB already close; capped
 *   EA PROGRAM - AVP        1080p60 9.5 Mb/s 166.6 MB 60 fps, phone capture
 *   cea fair                1080p60 10.1 Mb/s 114.3 MB 60 fps, phone capture
 *   ceafairfullvid          1080p24 10.3 Mb/s 151.6 MB very high bitrate
 *
 * Two of the three 1080p clips are 59.94 fps, which is phone footage in a
 * high-frame-rate mode. Halving to 30 fps removes about half the data with no
 * perceptible loss on event video, and is where most of the saving comes from
 * before quality is touched at all. The rest is a rate cap chosen per clip
 * from its own duration, and a step down to 1600x900, because 1080p at
 * 1.0 Mb/s looks worse than 900p at 1.0 Mb/s.
 *
 * Photos: WebP at two widths, 480 for a gallery grid and 1600 for a lightbox.
 * The largest supplied are 2048x1536 JPEGs and 1920x1080 PNGs of photographs,
 * 60.6 MB for 38 of them, because a photograph saved as PNG is roughly nine
 * times the size of the same photograph as WebP. No width is emitted larger
 * than its own source, so the 960x960 squares in Freshmen Tour do not get
 * upscaled into a pointless 1600.
 *
 * Filenames are slugified. The originals are "2024-2025 Research (12).png" and
 * "Freshmen Tour 2026 (3).JPG", which need percent-encoding in every href and
 * make a mess of any _headers or _redirects rule that wants to name one.
 */
import sharp from 'sharp';
import { execFile } from 'node:child_process';
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);

const SOURCE = 'media/source';
const PHOTOS_OUT = 'src/assets/media/photos';
const VIDEO_OUT = 'src/assets/media/video';

/** Widths emitted per photo, largest first. A width above the source is skipped. */
const WIDTHS = [1600, 480];

/** Cap per video, in bytes. 18 MB leaves headroom under the 25 MiB limit. */
const VIDEO_TARGET = 18 * 1024 * 1024;

const withVideo = process.argv.includes('--video');

const slug = (name) =>
	basename(name, extname(name))
		.normalize('NFKD')
		.replace(/[^a-zA-Z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

/** Only rewrite a file when the bytes actually differ, so reruns are free. */
async function write(path, buffer) {
	try {
		if ((await readFile(path)).equals(buffer)) return false;
	} catch {
		/* new file */
	}
	await writeFile(path, buffer);
	return true;
}

/* ------------------------------------------------------------------ photos */

let photoIn = 0;
let photoOut = 0;
let photoCount = 0;

for (const dir of (await readdir(SOURCE, { withFileTypes: true }))
	.filter((e) => e.isDirectory())
	.map((e) => e.name)
	.sort()) {
	const from = join(SOURCE, dir);
	const to = join(PHOTOS_OUT, slug(dir));
	await mkdir(to, { recursive: true });

	let dirIn = 0;
	let dirOut = 0;
	let dirInBytes = 0;
	let dirOutBytes = 0;

	for (const name of (await readdir(from)).sort()) {
		const path = join(from, name);
		const meta = await sharp(path).metadata();
		const stem = slug(name);

		for (const width of WIDTHS) {
			if (width > meta.width && width !== 480) continue;
			const target = join(to, `${stem}--${Math.min(width, meta.width)}.webp`);
			const buffer = await sharp(path)
				.resize({ width: Math.min(width, meta.width), withoutEnlargement: true })
				.webp({ quality: 82, effort: 5 })
				.toBuffer();
			await write(target, buffer);
			dirOutBytes += buffer.length;
		}

		dirIn += 1;
		dirInBytes += (await readFile(path)).length;
	}

	photoIn += dirInBytes;
	photoOut += dirOutBytes;
	photoCount += dirIn;

	console.log(
		`  ${dir.padEnd(26)} ${String(dirIn).padStart(3)} files  ${mb(dirInBytes).padStart(8)} -> ${mb(
			dirOutBytes,
		).padStart(8)}`,
	);
}

console.log(
	`\nphotos  ${photoCount} files  ${mb(photoIn)} -> ${mb(photoOut)}  ` +
		`${Math.round((1 - photoOut / photoIn) * 100)}% smaller\n`,
);

/* ------------------------------------------------------------------ videos */

if (!withVideo) {
	console.log('videos  skipped; pass --video and have ffmpeg on PATH to include them');
	process.exit(0);
}

const ffmpeg = process.env.FFMPEG || 'ffmpeg';
await mkdir(VIDEO_OUT, { recursive: true });

/**
 * Each clip's encode. `fps: null` keeps the source rate, which matters for the
 * 24 fps recording: re-encoding it to 30 would duplicate frames and cost
 * bitrate for nothing.
 */
const VIDEOS = [
	{ src: 'CEA Promotional Video.mp4', out: 'cea-promotional-video', width: 1280, fps: 30 },
	{ src: 'EA PROGRAM - AVP [fixed].mp4', out: 'ea-program-avp', width: 1600, fps: 30 },
	{ src: 'cea fair.mp4', out: 'cea-fair', width: 1600, fps: 30 },
	{ src: 'ceafairfullvid.mp4', out: 'cea-fair-full', width: 1600, fps: null },
];

try {
	await run(ffmpeg, ['-version']);
} catch {
	console.error(`ffmpeg not found at "${ffmpeg}". Set FFMPEG to its full path.`);
	process.exit(1);
}

/**
 * ffmpeg's banner, which is where the stream and duration information lives.
 *
 * It has to be read from stderr, and it has to be read despite a non-zero
 * exit: given an input and no output file, ffmpeg prints everything it knows
 * and then fails with "At least one output file must be specified". That
 * failure is the normal result of probing, not an error.
 */
async function probe(path) {
	try {
		const { stderr } = await run(ffmpeg, ['-hide_banner', '-i', path]);
		return stderr;
	} catch (error) {
		return error.stderr || '';
	}
}

for (const video of VIDEOS) {
	const from = join(SOURCE, video.src);
	const to = join(VIDEO_OUT, `${video.out}.mp4`);

	const banner = await probe(from);
	const duration = Number(/Duration: (\d+):(\d+):([\d.]+)/.exec(banner)?.slice(1).join(''));
	if (!duration) throw new Error(`no duration in ${video.src}`);
	const sourceBitrate = Number(/Video:.*?(\d+) kb\/s/.exec(banner)?.[1]);

	// Bitrate that lands the encode on the target, with a little slack so the
	// result is under the cap rather than exactly on it.
	const kbps = Math.floor((VIDEO_TARGET * 8) / duration / 1000);

	const filter = [
		video.fps ? `fps=${video.fps}` : null,
		`scale=-2:${video.width}`,
	]
		.filter(Boolean)
		.join(',');

	await run(ffmpeg, [
		'-y',
		'-i', from,
		'-vf', filter,
		'-c:v', 'libx264',
		'-preset', 'slow',
		// CRF for quality, the rate cap for size. x264 spends the cap on the
		// scenes that need it instead of spreading it evenly.
		'-crf', '24',
		'-maxrate', `${kbps}k`,
		'-bufsize', `${kbps * 2}k`,
		'-profile:v', 'high',
		'-pix_fmt', 'yuv420p',
		'-c:a', 'aac',
		'-b:a', '128k',
		// Without this the whole file has to arrive before it will play.
		'-movflags', '+faststart',
		to,
	]);

	// A poster, or the browser shows a black box before the first frame.
	const poster = join(VIDEO_OUT, `${video.out}-poster.webp`);
	await run(ffmpeg, ['-y', '-i', from, '-ss', '2', '-vframes', '1', '-q:v', '4', poster]);

	const before = (await readFile(from)).length;
	const after = (await readFile(to)).length;
	const hardLimit = 25 * 1024 * 1024;

	console.log(
		`  ${video.out.padEnd(22)} ${mb(before).padStart(8)} -> ${mb(after).padStart(7)}  ` +
			`${sourceBitrate}->${kbps} kb/s, ${video.width}p${video.fps ? `@${video.fps}` : ''}  ` +
			`${after < hardLimit ? 'under the 25 MiB limit' : '*** OVER THE LIMIT ***'}`,
	);
}
