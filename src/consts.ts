/*
 * Site constants.
 *
 * The copy in this file is the text of the Institutional Modernism design
 * system authored for this College in Google Stitch (project
 * 16985470719422672898, "Engineering and Architecture Portal"). Every string
 * here comes from that project's "Programs & Admissions" screen and is used
 * verbatim, including its claims about accreditation, laboratories, capstones,
 * scholarships and metrics. See CONTENT-SOURCING.md for the record of which
 * statements are unsubstantiated by the College's own record.
 *
 * Routes come from the prototype's own `data-path` attributes, so the paths the
 * design was built around are the paths this site uses.
 */

export const SITE_NAME = 'College of Engineering & Architecture';
export const SITE_TITLE = 'UIC-CEA';
export const SITE_DESCRIPTION =
	'University of the Immaculate Conception College of Engineering and Architecture — four academic programs in architecture, civil, computer and electronics engineering.';

/** The University, as the design's utility bar and footer name it. */
export const PARENT_INSTITUTION = 'University of the Immaculate Conception';

/** Where every "Enroll Now" on the site points. */
export const ENROLL_URL = 'https://enrollment.uic.edu.ph/';

/** The hero line, split so the two halves can take the gradient independently. */
export const HERO_HEADLINE = ['Designing Spaces,', 'Engineering the Future'] as const;

/** The announcement above the utility bar. */
export const ANNOUNCEMENT = 'Ready for your next chapter? Academic Year 2026-2027 Admissions Open';

/** The academic year the admissions material is written for. */
export const ACADEMIC_YEAR = 'AY 2026-2027';

/**
 * The four metric tiles under the hero. Stitch's figures, kept as written.
 */
export const HERO_METRICS = [
	{ value: '4', label: 'CHED Accredited Programs' },
	{ value: '100%', label: 'Industry Capstones' },
	{ value: '8+', label: 'Specialized Laboratories' },
	{ value: '1992', label: 'Tradition of Guilds' },
] as const;

/**
 * Contact block, used by the homepage contact band and by
 * /contact-and-inquiries. The same five channels in the same order as the
 * prototype.
 */
export const CONTACT = {
	eyebrow: 'College Communications Office',
	heading: 'For inquiries, you may contact us through:',
	lead: 'Get in touch with department chairs, academic advisers, and laboratory administrators for campus tours and program enrollment guides.',
	rows: [
		{
			icon: 'call',
			label: 'Telephone',
			value: '227-1573 Local 222',
			href: 'tel:+63822271573',
		},
		{
			icon: 'mail',
			label: 'Email',
			value: 'cea@uic.edu.ph',
			href: 'mailto:cea@uic.edu.ph',
		},
		{
			icon: 'thumb-up',
			label: 'Facebook',
			value: 'CEASOwolves',
			href: 'https://www.facebook.com/CEASOwolves',
			external: true,
		},
		{
			icon: 'language',
			label: 'Website',
			value: 'UIC Site (www.uic.edu.ph)',
			href: 'https://www.uic.edu.ph/',
			external: true,
		},
		{
			icon: 'location-on',
			label: 'Address',
			value: 'Bonifacio Street, Davao City 8000',
			href: 'https://maps.app.goo.gl/voZkT3ajrhLGqgkNA',
			external: true,
		},
	] as const,
	/** Shown inside the map plate rather than as a labelled row. */
	campus: {
		label: 'Bonifacio Campus',
		action: 'Open in Maps',
		href: 'https://maps.app.goo.gl/voZkT3ajrhLGqgkNA',
	},
} as const;

/**
 * The four programme marks, one per degree. The artwork is the College's own
 * logo for that programme, held in `logos/`, processed into `src/assets/logos/`
 * by `scripts/build-logo-assets.mjs` and drawn by `ProgramMark.astro`.
 */
export type ProgramMarkName = 'architecture' | 'civil' | 'computer' | 'electronics';

export const COPYRIGHT = `© ${new Date().getFullYear()} University of the Immaculate Conception • College of Engineering and Architecture. All rights reserved.`;

/*
 * Footer and bottom-bar policy links.
 *
 * The design's footer carries "Data Privacy Policy", "Terms of Use" and
 * "Campus Directory". This site publishes none of the three — inventing policy
 * text for a real university is not something a design system should decide —
 * so they are rendered as plain text in the bottom bar rather than as links
 * that would 404. See CONTENT-SOURCING.md.
 */
export const POLICY_LINKS = ['Data Privacy Policy', 'Terms of Use', 'Campus Directory'] as const;

export interface NavChild {
	label: string;
	href: string;
}

export interface NavItem {
	label: string;
	href: string;
	/** When present the item becomes a disclosure button instead of a link. */
	children?: NavChild[];
	/** Distinguishes the outgoing call to action from the section links. */
	external?: boolean;
}

/**
 * Primary navigation, in the design's order.
 *
 * "Archives" was a third top-level item in the prototype and has been dropped:
 * the prototype is a single screen, so the item had no page behind it and no
 * content to carry. The Featured Works page is the site archive.
 *
 * The Events & Retreats screen of the design gave "Events & Retreats" a menu of
 * four children — All Events & Retreats, Engineering & Architecture Week,
 * Spiritual Formation Retreats and Archives. Only the first of the four has a
 * screen, so only the first has a page here, and the bar carries a plain link
 * rather than a menu whose other three entries would lead nowhere. A bar item
 * that looks like a menu and opens a page, or worse a menu of dead ends, is the
 * defect this bar was rebuilt to avoid. See CONTENT-SOURCING.md.
 */
export const NAV: NavItem[] = [
	{ label: 'Home', href: '/' },
	{
		label: 'About CEA',
		href: '/about/our-pride',
		children: [
			{ label: 'Our Pride', href: '/about/our-pride' },
			{ label: 'CEA Logo & Seal', href: '/about/cea-logo-and-seal' },
			{ label: 'Scholarships Offered', href: '/scholarships-offered' },
		],
	},
	{
		label: 'Programs Offered',
		href: '/programs',
		children: [
			{ label: 'BS Architecture', href: '/programs/bs-architecture' },
			{ label: 'BS Civil Engineering', href: '/programs/bs-civil-engineering' },
			{
				label: 'BS Computer Engineering',
				href: '/programs/bs-computer-engineering',
			},
			{
				label: 'BS Electronics Engineering',
				href: '/programs/bs-electronics-engineering',
			},
		],
	},
	{ label: 'Featured Works', href: '/featured-works' },
	{ label: 'Events & Retreats', href: '/events-and-retreats' },
];

/*
 * The Student Affairs & Retreat Office named on the Events & Retreats screen.
 *
 * The design gives this office its own address, its own coordinator and its own
 * building floor, none of which the College's published record confirms. The
 * address is used because the page needs somewhere real to send an inquiry to
 * and because the design names it; the College's own general address is offered
 * beside it everywhere, so nothing here is the only way to reach the College.
 * See CONTENT-SOURCING.md.
 */
export const EVENTS_OFFICE = {
	email: 'cea.events@uic.edu.ph',
	alternate: 'cea@uic.edu.ph',
	person: 'Treshia Loraine Vitor',
	role: 'CEASO Executive Coordinator & Administrative Assistant',
	phone: '(+63 82) 227-1573 Loc. 222',
	hours: 'Monday – Friday: 8:00 AM – 5:00 PM',
	building: "Dean's Office & CEASO Headquarters",
	address: '2nd Floor, Engineering Bldg., Bonifacio Campus, Davao City',
} as const;

export const FACULTY_FACEBOOK = 'https://www.facebook.com/CEASOwolves';
export const CAMPUS_MAP = 'https://maps.app.goo.gl/voZkT3ajrhLGqgkNA';
export const UIC_SITE = 'https://www.uic.edu.ph/';

/*
 * The utility bar, above the midnight navigation. Three of the four channels
 * are the same as the contact block's; the fourth is the enrolment portal.
 */
export const UTILITY_LINKS = [
	{ icon: 'mail', value: 'cea@uic.edu.ph', href: 'mailto:cea@uic.edu.ph' },
	{ value: '227-1573 Loc. 222', href: 'tel:+63822271573' },
	{ icon: 'location-on', value: 'Bonifacio St., Davao City', href: CAMPUS_MAP },
] as const;

/**
 * Imagery.
 *
 * The design's nineteen images are all remote files on Google's CDN and all of
 * them are generated, not photographic records of this College — they depict
 * invented laboratories, invented student projects, invented event scenes, two
 * invented faculty portraits and an invented emblem. They are kept because they
 * are part of the design being adopted, and because there is no other image
 * available to put in these slots. Alt text describes the illustration without
 * asserting that the scene exists at Bonifacio Campus.
 *
 * The emblem is the one exception worth naming. It is used in the header and
 * footer as a decorative motif, but the page a visitor is most likely to read
 * as the institution's own identity — /about/cea-logo-and-seal — now shows the
 * College's actual logo instead. The College's real marks, local and processed,
 * are in `logos/` and `src/assets/logos/`.
 *
 * All nineteen must be replaced with the College's own photographs before this
 * is published as a record of the institution. See CONTENT-SOURCING.md.
 */
const CDN = 'https://lh3.googleusercontent.com/aida-public';

export const IMAGES = {
	emblem: {
		src: `${CDN}/AB6AXuDaEG26WqKoPAjDrLXep1C1Kk3qTVN4VY-4ys4qxDdOiyuDQT9Ej_h0YqF_3wu-Jii_QVtg4T0We2xrgZhGPdzM0AM6CrZJf9YGu0oIbwBAmFa8SZmRUngFVzPEnCII2YvYekPLhlnNbA4KespSV6AIPRTm8PxRoJyP3CfPxYlN-uxEsJK24tSlb6Cj4tr8UBoBcZym1Sdz72q1H4FLjwzmAaa_MUjuWvx26DbT85zP9rHoayxEHVqzEw`,
		alt: 'UIC College of Engineering and Architecture emblem',
	},
	hero: {
		src: `${CDN}/AB6AXuCp3KK5sjv6ssYbcMyaKodyhYKu0uRNA4-7GkdWC4lWjf1ro4CwbKpUIndBw41EDIsUrrTH3TWeax1UxNNb-4o9COoC07YSFj8iwHPlwUD7HwSp73CpTZyHS2dVpl2TD2SqIoFNxy7aluqGvWeMk3tl5N6AgYt5tL4bIWPGYjfjnFElQf48-ic7ck7ba3AzYKHzHXfjA_xZqUTMrmkF_T5oBKkMiEY2URPKxfJ30NSqe2VREQ4kI2WOHQ`,
		alt: 'Illustration: an isometric architectural render lit by orange and amber blueprint lines, showing tower skeletons, circuit traces, robotic arms and bridge trusses on a dark navy ground.',
	},
	wings: {
		architecture: {
			src: `${CDN}/AB6AXuDyQ6H56U0kygh88dvoTSgRqCNV4fdYmLhKEg98N6HdLCQ1NcjpTUEdUINy4qdvvP9cWSqPZmg4DR-QijWl14aS3lTSAdey0QgcOBw1GPMeVAGyBA-MHfQDYOPYqNJkBdjPO13pP5u27AHBngzriwEVZydzJ9KAL57oGHwwuBhKLzKRxjoQ8sVLhbkfgxLkqRk-Rf8qbSGZAfmX_-EUIXZZoX1o8ued1BU2686qJtdvnXTUtFXr8p_Jgw`,
			alt: 'Illustration: an architecture studio with drafting tables, blueprints, T-squares and scale models in morning light.',
		},
		civil: {
			src: `${CDN}/AB6AXuDjWMUrnbNrShgkKeTUdxFTWCim1ojBAw1v7S_IXCcURdOSBzZLK1S8GNEoRqlQgFyBB8TeFSE-DXSzUQoq38zo8vUGGipboDqahx4YsO2Vcz-d6kwhcsVZwW6KnQGlrfvPvB8_Rmzn7fTN1AVqM4OIcqu6xWiAnVPfOLHWeCzJoqZLVTalghsC69j0rj4bGP-FeAtZ3yK9A3Qtqs-WJIZMtj9HvzkxzSubdMr4nYompvg7dDXjIyMMWg`,
			alt: 'Illustration: a materials testing laboratory with a concrete compression tester, sieve shakers and soil mechanics instruments.',
		},
		computer: {
			src: `${CDN}/AB6AXuBm15T4jYtzPAE2jTMUAmdk21Kv4hbbIe4F9X_0_kt71Ik_g_TVkweSygl_5qodCzkL-P08Y_2eMPb4Kl3J9XSMnAW8yg2HL6Oy9LF2bkDFmZQtyhSs8GYPvVmgVReCyuvM4Z4aYEaCbZECJduuuYcpplnfo2FtF9cPtD7l_QRixnDWjy2EoL5Lxr3_RJm3Yet6myh2XmaNgvmDkX_U1GC317RY8NNgYpfxo14xjmnlywTsYLeW8IT-bA`,
			alt: 'Illustration: a computer engineering laboratory with dual-monitor workstations, FPGA boards, microcontroller kits, oscilloscopes and rack-mount network switches.',
		},
		electronics: {
			src: `${CDN}/AB6AXuA3-4FeEAC0-2IvDIToUAMONAcbC7xiubDDhUlvOngyV81QcWJYgY0MSiHzYZwFE4PzYrF2LSddE_ZE3uqAFg9coiwZkd160tHoeMZs0DDNkVvaIe-XFDifSP3sNK9tyQoKjU1gr68J8ZwcjyscyqFYBJTRF-WPPyXrrAj4pK3lTKDyWCqR54fA_6ManDUG-vZ8gc-OdTt4PDO42z-pd_gDs4gqtbNA26A4k5xuKXl44E35J99qXnLaig`,
			alt: 'Illustration: an electronics laboratory with digital oscilloscopes, spectrum analysers, soldering rework stations and RF waveguides.',
		},
	},
	works: [
		{
			src: `${CDN}/AB6AXuA-w-YKOrtbx-5EuGIxmXWvZNDTtEXhQBLqk9ki2iunIwDVMWrecNhoVTJ-13HZsrAUZCwCMpoHgqxXR-dONnj5dMYgQbiKUxK4dVko82rFWSTb2lc5B0GVliuXcHNNeRWcMvMdWbKqOR0PTBmWcGszIc0nbyZO-VcfHjPCJ-eUsTnomTXtZetzJMDaVQcy1ks_DFCAVR4tIhNwCtKho5KHTg1PONiTH71j34rdmIG7tabq2I7t3oNRyQ`,
			alt: 'Illustration: a civic centre scale model in balsa and acrylic with green cantilever roofs and solar shading.',
		},
		{
			src: `${CDN}/AB6AXuCbwz_RyAzaZl6SDn2vEk3s61Q_dNz7oa9ROOrDOX8jDZJLhSn9PwCsJloXJlzaT4QAohxTFlGWWMstym-Bwg5o-6WmoO5i5pX3btfZnNvYq4ckBe9__vdpQBGBZzuPE83EKiF5gi8w6m4AGNnqctWzM20FrpcNJnRswsq5uCAZO0Un1y9LgYUwF_VVTNEpaL0SA1BgEKL2NBSbKtB98qcEOSx_zhK3y7F03eIFrlhu8cNIRYDhsQXj5Q`,
			alt: 'Illustration: a four-wheel agricultural inspection rover with stereo cameras and telemetry sensors in a test field.',
		},
		{
			src: `${CDN}/AB6AXuABJCv-dPhOxwfUB5SmNqZ3CG66ME_sQRURS60PcwaCIa2wG6T6-_CydJx3zk3DLQSV8cq2HWAuB_DZnXeYHs4EZ0OkXuujhi4kQwMzTLOYC9jQyikvstLLvIe_HNImp1at0rTetDB0aSz0chxSdHxfHFxRDbLaO5O8RfSoCpZk7uPOmax5ysAMtJUisACuCgocLJb9vo08AtJoW2mWLgzn9toUM0lXXxWnNyAfMf3ATV7guSG_0nztAg`,
			alt: 'Illustration: a scaled steel suspension bridge section on a shake table under vibration test, with strain gauges attached.',
		},
	],
	/*
	 * The Academic Programs screen draws a wide laboratory plate at the head of
	 * each programme card, one per discipline. They are separate files from the
	 * `wings` set above, which the homepage uses at a different crop.
	 */
	programCards: {
		architecture: {
			src: `${CDN}/AB6AXuBuWLnBMUKueyKacJYO-8m7W-ikwpgCdvyc4_Y8ViEoYaxrKnG-wV76E4rofdwB-YaOUbbMbaBFpUJoYgN_n5nP68_lnTfcxnjh4-IMXIJP-fAgfPCFTHQiX9JyrvgxYI-IMSepLgNzPZ0_6vMRyi0nhkUieq8kJwPlA85MS2j9wz1iwGBfmNmUuc_08lIQytze0yZE_DfPtRTdwZyzOK9NY44oTmgw4a1TuZrAWJA4ztduCKSHTs_G-A`,
			alt: 'Illustration: an architecture studio interior with drafting tables, blueprints and BIM/CAD workstations.',
		},
		civil: {
			src: `${CDN}/AB6AXuCCGKmhBJB7VUVyZpm9hk5Dj3i5x4cpFMrRWQP8GG_mzjuiw9fe3aN1kqHmJs-8P_SqvwM4y53SIllmO1G17u655E_WNlYEQe29uxjGzrdXwPPtFYguijzwEsfcgLnxTew7kFBh2g_Rkh7VYn2uOICkNry2ZdwVyvX5czAFsro278eOIzqOlu10tKnGyzMuEtP_30hw-pmmy8P9ZES59Awkew2Oii_larq0EaQ97DzYFh7YyMs-Xdn5bw`,
			alt: 'Illustration: a civil engineering structural materials testing laboratory, with concrete beam stress testing apparatus and total stations.',
		},
		computer: {
			src: `${CDN}/AB6AXuDRdF3iMHDb5Mdx0QREl8AiK9_wpY8cHcqqKtmLbXDAwEM_A1n0PAX1aYrd9UsxlunroUT36dZEEJUIst2N2ckGq4hUll_1pXJ7-0XUaXom2VBlVswdLhtjcacm_UvIsNBmGpYWBn4qkB-LMk1U7BzcsnEHg6Ge_RLYTNQX0c83l4aQa_t7a-rjiIJDGVAEjiTHHBWEl1OnifZdJCkjO18czR6taK6rebauzUGct87H4wb34wouUEqShA`,
			alt: 'Illustration: a computer engineering hardware and robotics laboratory, with circuit boards, microcontroller and FPGA boards on dual monitors.',
		},
		electronics: {
			src: `${CDN}/AB6AXuDdBClni2JuobhyMGulbl9ACfyp4RLIaLO3dkSaXQMZ5PTg5kjPbhIuJ4i3jc2yATj61QwYAT3VWAOQT9nIRgsLDwXCqJtAFlWDorKvZws5iIW7UccoCBF5IHPl8JiTNNpSGR9QHhqS3_q1tf8ejQ6YeSxUwWhuEA6Uph3aVG7qT3-u1pYqZuHnLKaPwsAzDtiK-QeKzCqFhZt2SjBeA72-T1ESZyQXOv0KmS6SO0jTURoIkj2ZTEQlDw`,
			alt: 'Illustration: an electronics engineering laboratory with oscilloscopes, RF spectrum analysers and telecommunications antennas.',
		},
	},
	/*
	 * The Faculty Directory draws two portraits. Every other person on that page
	 * is shown as a drafting-board monogram instead of a face, which is the one
	 * place the design happens to be honest about the fact that it has no
	 * photographs of the faculty. See CONTENT-SOURCING.md.
	 */
	faculty: {
		dean: {
			src: `${CDN}/AB6AXuBM8kNF7aI835g6QeSM5NHhneHv6BT8fO1g3Aa3mkwylrwV0YSJILcWec4u_Vs7JFCYrZMVKY9oG_zPrnA4gpCYijowkmpKPA09ZUAJ3-MFF3s8kO3cxAJbZuyhlcNLsKi6tNo4j4lXDAJ_D0VgYsrFN5gQHVrPWV18F8LVd6PhSvwGrowQc3nUgdR9ELK0dneAIWYKaqDbxhFm42H_TazBZ7N5eJOpPaM2RR-_kSIHu2q6ivpmeD_42w`,
			alt: 'Illustration: a portrait of a Filipina engineering dean in a blazer, used as the Dean of the College of Engineering and Architecture.',
		},
		coordinator: {
			src: `${CDN}/AB6AXuCP36eAWS-eMJm8nY-DnLQcm1OMQHMDpxXKP-gdI4vZ5DQswqefsyExXaZf-KCzKyD_SNDuGMF62BB1OMoSZnUuOQaGgHtfOrEJbf8GqcWbuaInlh6l-CgYN9zGSi4oAtrVr-GSpUO4Qnei0s5RICbM6-1MoSHrxmxIy5igbBIcylxw2W9rpEcE_hMW4c_n-soakQRgKGh4uF9fWpvQXnEYVV-X4ZMXlyUTZ5W8mK-1RcU4f1tbB6uLrg`,
			alt: 'Illustration: a portrait of a Filipino architect in studio clothing, used as the Program Coordinator of Architecture.',
		},
	},
	/*
	 * The Events & Retreats screen. Three generated scenes, each used twice: once
	 * as the plate on a featured spotlight and once in the retrospective gallery
	 * beside it, which is how the design itself reuses them.
	 */
	events: {
		retreat: {
			src: `${CDN}/AB6AXuB_BFVuo-m7j3yy1yRQL9X4kSIkB3MEAXSst4VzR7-rVY6FLIosnf64xWVKhpZv0NtyIbXCz_vFeWqrJG7Gf2tH6hq3ryWO6U-DsEQkq0WtdSGlkWx1Rh_0fQVaqSjs7ZpcdorxB7zULnCmabh2ZGEXmKHaRDBLdDxnoFV6xG3ebuEGtiUYn6G0-CAeTZTDgOFUlqRIgQUcGctza3rgc5EAzUdbA1Mon8j3guKMs_6Dslm26D5Zi5L21Q`,
			alt: 'Illustration: students at a campus spiritual retreat and reflection session, seated in a circle in an outdoor chapel setting.',
		},
		sports: {
			src: `${CDN}/AB6AXuBJQZ58UiIXdNGsw77eCFV0nB5dBW2rhnqCJFqABb5HiliFi8MauuV1X1dm5RsU6E1fK6o8ebWDIo4Xg9qPR0GQ6FlZq5aS1TAtLJF1MPSCjh59WjP0D5KHhmECSdCUbGig23sD3nBvutlqb3uILfHrRfzEvt5774QFI-By4CTImxwUxpRT1Oy5c_4g9mdp38Zwwei_0d7cmBqOQsrsp6eoQukKp_HuvPT5VP7vxn7Ms2E1tovO9Ev0eQ`,
			alt: 'Illustration: university students and faculty at a campus outdoor recreation day, taking part in an inter-departmental teambuilding competition.',
		},
		extension: {
			src: `${CDN}/AB6AXuBDYsdPmi5rfh0AiWZc1-crbRk5f2BEv7lbVebd9jAcHLnNzzzlynLuN-AowglVnNncOt3nRqBmPh5AMWLUUNv--ETwg4ENY-UV58LYvB_LlR8_kvqwNIgaK3xrCnJaQF6SWzoELkoLW5LWt0Y60lZbqM0B2QnUPtLRBXfkT5qlig8jGBvU__iCTFxzd-wUJO2KGVmtiQzESOPtmzpBfDrcYPNBoR5UwGfcd-t6R3h5fOH7Uf_AS0SdAw`,
			alt: 'Illustration: Filipino engineering and architecture students and faculty conducting a community extension project in Davao.',
		},
	},
	map: {
		src: `${CDN}/AB6AXuDG-O7CEego2PXjwnCMsTYnrXFTnjiaHMONxozM9_SqXfzE1-oDRqiFPfi3AefYGxfcu6BfHIc5T9p9LTYHD7de14v2yFqrU6JPaNLqGbJn5iovfbPTlbj6t5AI_dBEgmiMQ99mmvZ3FHF7hdJh3ZVOJ1MEuJwUY-1GpfKZcyYkbsIw_Z3fOTTw7FKtXUhcrhjp1NNPyOfea-3wntZB4ztMNVKBV1SSbhnuQ9_OVoEFNkNKxpXSOKVe9A`,
		alt: 'Illustration: the approach to the Bonifacio Campus on Bonifacio Street, Davao City.',
	},
} as const;
