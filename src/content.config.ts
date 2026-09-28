import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/*
 * The College's four undergraduate programs and the student works shown in
 * Featured Works. Both are records whose fields repeat across the homepage,
 * the programme index, four programme pages and the works archive, so they live
 * in a schema rather than in prose. Each is a single JSON array loaded through
 * the file() loader, and every entry carries an explicit `slug` because the
 * loader's generated id is only an array index.
 */

/** Which of the four generated discipline marks a programme wears. */
const MARKS = ['architecture', 'civil', 'computer', 'electronics'] as const;

/**
 * The kind of a faculty member's credential.
 *
 * The Faculty Directory draws a different glyph against each kind — a
 * mortarboard for a degree, a rosette for a licence, a ribbon for a
 * certification, a cap for a chapter office, a badge for a professional
 * membership, a case for industry work. Keeping the icon in the kind rather than
 * in the text means editing a credential never risks attaching the wrong glyph
 * to somebody's record.
 */
const CREDENTIAL_KINDS = [
	'degree',
	'licence',
	'certification',
	'membership',
	'leadership',
	'industry',
] as const;

const programs = defineCollection({
	loader: file('./src/content/programs.json'),
	schema: z.object({
		slug: z.string(),
		/** Degree name, e.g. "BS Architecture". */
		name: z.string(),
		/** The copper overline above the name: "5-Year Professional Degree". */
		overline: z.string(),
		/** The degree spelled out, for the Academic Programs screen. */
		fullName: z.string(),
		/** The long-form paragraph under the degree on that screen. */
		longDescription: z.string(),
		/** The short paragraph used on the cards and the programme pages. */
		description: z.string(),
		competencies: z.array(z.string()),
		/** The two chips laid over the card's photograph. */
		badges: z.array(z.string()),
		/** The student guild as the card's corner plate: "UAPSA Student Guild". */
		guildShort: z.string(),
		/** Full expansion of the student guild, shown in the card's guild block. */
		guildFull: z.string(),
		/**
		 * The same guild, in the wording the programme index and the four
		 * programme pages already use. It differs from `guildFull` because each
		 * is the design's own expansion on the screen it was written for.
		 */
		guild: z.string(),
		/** The guild cell in the comparison matrix. */
		matrixGuild: z.string(),
		/** The licensure board cell in the comparison matrix. */
		board: z.string(),
		/** The accreditation figure in the card's three-up spec bar. */
		accreditation: z.string(),
		duration: z.string(),
		units: z.string(),
		ojt: z.string(),
		/** The specialisations listed as pills under the description. */
		pillars: z.array(z.string()),
		/**
		 * One entry per year of the degree. The last is the capstone year, which
		 * the page draws in copper — the design's own distinction.
		 */
		roadmap: z.array(
			z.object({
				year: z.string(),
				label: z.string(),
			}),
		),
		/** The graduate outcomes listed under the roadmap. */
		careerPathways: z.array(z.string()),
		/** The programme-specific wording on the card's primary button. */
		enrollLabel: z.string(),
		/** The short form set inside the badge mark, e.g. "PICE UIC". */
		badgeLabel: z.string(),
		mark: z.enum(MARKS),
		/** Key into IMAGES.programCards: the plate at the head of the card. */
		cardImage: z.enum(MARKS),
		/** The programme's entry in the four-card wing grid. */
		wing: z.object({
			title: z.string(),
			lab: z.string(),
			description: z.string(),
			/** Key into IMAGES.wings. */
			image: z.enum(['architecture', 'civil', 'computer', 'electronics']),
		}),
		order: z.number(),
	}),
});

const works = defineCollection({
	loader: file('./src/content/works.json'),
	schema: z.object({
		slug: z.string(),
		/** Slug of the program the work belongs to, for the card's link. */
		programme: z.string(),
		/** The navy or copper badge over the image. */
		badge: z.string(),
		badgeTone: z.enum(['navy', 'copper']),
		title: z.string(),
		abstract: z.string(),
		/** Proponent or awarding body, shown in the card's footer. */
		credit: z.string(),
		/** Index into IMAGES.works. */
		image: z.number(),
		order: z.number(),
	}),
});

/*
 * The faculty roster.
 *
 * Five sections, and they are not all drawn the same way because the design does
 * not draw them the same way: `dean` is the Office of the Dean, where the Dean
 * and the administrative assistant each get a card of their own, and the other
 * four are departments of teaching faculty. An entry with a `portrait` shows
 * that photograph; one without shows the drafting-board monogram, because the
 * design has no photograph of them either.
 */
const faculty = defineCollection({
	loader: file('./src/content/faculty.json'),
	schema: z.object({
		/** Stable key, used for the section anchor and the filter target. */
		id: z.string(),
		section: z.enum(['dean', 'architecture', 'civil', 'computer', 'electronics']),
		name: z.string(),
		role: z.string(),
		/** The copper focus line above the name, e.g. "Licensed CE • PICE". */
		focus: z.string().nullish(),
		/** The chip in the corner of the card. */
		badge: z.string(),
		/** `copper` for a coordinator, `navy` for teaching faculty. */
		badgeTone: z.enum(['navy', 'copper']),
		/** Post-nominals, set as filled chips under the Dean's portrait. */
		postnominals: z.array(z.string()).default([]),
		/** Key into IMAGES.faculty, or null for the monogram. */
		portrait: z.enum(['dean', 'coordinator']).nullish(),
		credentials: z
			.array(
				z.object({
					kind: z.enum(CREDENTIAL_KINDS),
					text: z.string(),
				}),
			)
			.default([]),
		/** The Dean's statement. Only the Office of the Dean has one. */
		quote: z.string().optional(),
		/** The administrative assistant's degree, as a block rather than a list. */
		background: z.string().optional(),
		/** The administrative assistant's responsibilities. */
		functions: z.array(z.string()).optional(),
		hours: z.string().optional(),
		location: z.string().optional(),
		/** A closing line on a teaching-faculty card. */
		note: z.string().nullish(),
		order: z.number(),
	}),
});

/*
 * The collegiate events calendar.
 *
 * Seven rows in the design's own order, which is not chronological: the screen
 * lists them as its author wrote them down rather than sorted by date, and the
 * `order` field preserves that. Each row is filtered by `category` and searched
 * by the free-text field on the screen, so `category` is an enum drawn from the
 * six filter pills rather than free text — the same reasoning as `mark` on the
 * programmes.
 */
const EVENT_CATEGORIES = ['extension', 'retreat', 'guild', 'academic', 'sports'] as const;

const events = defineCollection({
	loader: file('./src/content/events.json'),
	schema: z.object({
		slug: z.string(),
		/** Day of the month, set large in the date plate: "12". */
		day: z.string(),
		/** Month and year under it, in the plate's own caps: "NOV 2025". */
		month: z.string(),
		/** Filter target. One of the five pills other than "All Activities". */
		category: z.enum(EVENT_CATEGORIES),
		/** The chip on the row, e.g. "Community Extension". */
		badge: z.string(),
		/** Who the row says the event is open to. */
		audience: z.string(),
		title: z.string(),
		location: z.string(),
		/** The design prefixes this one with the word "Led by". */
		ledBy: z.string(),
		/** The time span in the plate beside the row's button. */
		schedule: z.string(),
		order: z.number(),
	}),
});

export const collections = { programs, works, faculty, events };
