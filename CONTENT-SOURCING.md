# Content sourcing

Everything on this site is the copy of the **Institutional Modernism** design
system authored for the College in Google Stitch — project
`16985470719422672898`, "Engineering and Architecture Portal" — used verbatim.

This file records what that means, because the prototype it came from was
written as a design demonstration and a significant part of its wording is not
substantiated by the College's own published record. It is the working list for
whoever signs the site off.

Two facts established before this rewrite, and the reason for the file:

- Measured against the College's legacy site, **1 of 30** sentences in the
  prototype overlapped the real institutional copy at all; 18 of 30 overlapped
  by less than 15%. The prototype was not a summary of the real site.
- The College's real published accreditation position, per the CHED memorandum
  on its own benchmark, is **one** accredited programme out of four.

## Claims to confirm or replace before publication

Accreditation status is a regulated representation in the Philippines. On a
live page, under the College's name, these are the statements a reader will act
on.

| On the site | Where | What the College's record shows |
| --- | --- | --- |
| "4 CHED Accredited Programs" | Hero metric | One programme is accredited, and the accreditor is PAASCU, not CHED. |
| "PAASCU Level III • PTC-ACBET Accredited" | Footer, `/about/our-pride`, `/about/cea-logo-and-seal` | The accredited programme is BS Computer Engineering at PAASCU **Level II**. There is no PTC-ACBET accreditation. Level III is the highest tier and is a materially different claim. |
| "100% Industry Capstones" | Hero metric | Unsubstantiated. No placement or capstone-sponsorship figure is published. |
| "8+ Specialized Laboratories" | Hero metric | Unsubstantiated. The College publishes no laboratory inventory or count. |
| "1992 Tradition of Guilds" | Hero metric; "ECES • EST. 1992" on the Electronics mark | The University claims 114 years. 1992 appears in the prototype without a source. |
| "PACUCOA & PTC Aligned Standards … under Washington Accord guidelines" | `/`, `/about/our-pride` | The programmes are benchmarked to the **Singapore chapters** of their professional bodies. Washington Accord is a different arrangement, and PTC is not among the bodies named. |
| "DOST scholarship accredited status, and CEASO alumni endowment incentives" | `/scholarships-offered` | A government scheme and an endowment fund named on a public page. Neither is published elsewhere by the College. |
| "Accredited outcome-based education (OBE)" | `/`, `/about/our-pride` | Depends on the accreditation position above. |
| Named laboratory equipment | Wing cards, programme pages | Specific equipment claims — universal testing machines, FPGA platforms, spectrum analysers, antenna radiation pattern rigs. Needs a facilities sign-off per wing. |
| Three named capstone projects and their proponents | `/`, `/featured-works` | A public transit hub, a cacao-planting rover and a seismic damper study, each credited to a named guild. The abstracts read as real records of work. |
| Per-programme accreditation tiers: "PACUCOA Level III", "PTC-ACBET", "PTC Candidate", "PACUCOA & IECEP" | `/programs`, the four programme pages, the comparison matrix | A sharper claim than the College-wide one above, and it now tells the four degrees apart. The College's record shows one accredited programme, BS CpE, at PAASCU Level II. Nothing supports a Level III architecture accreditation or a PTC candidacy. |

Two further items, lower risk but worth a decision:

- The four programme descriptions state each degree's disciplinary focus. These
  are plausible and consistent with the degrees, but they are the prototype's
  wording rather than the College's.
- "ECES / IECEP (Electronics Engineering Organization)" is presented as the
  Electronics guild with a founding year. The College's own listing differs, and
  the 1992 is covered above.

## The faculty directory

`/about/our-pride` is the design's **"UIC-CEA Our Pride: Dean & Faculty
Directory"** screen. It names fifteen real-looking people with their
post-nominals, degrees, licences, guild offices and employers:

- Engr. Juvie Pauline L. Relacion, PCPE, MEng-CpE — Dean, and Coordinator of
  Computer Engineering
- Treshia Loraine T. Vitor — College Administrative Assistant
- Ar. Leonida D. Santos, Ar. Jacob G. Clave, Ar. Marco Antonio G. Bermudez,
  Ar. Ramon D. Tanglao — Architecture
- Engr. Peter Adrian T. NGO, Engr. Emma Concepcion M. Fuentes, Engr. Johndel V.
  Quiño — Civil Engineering
- Engr. Eddie Vic S. Alacaba, Engr. Emmanuel Jr E. Vergara — Computer
  Engineering
- Engr. Shiela Mae V. Quinamot, Engr. Rhenan G. Tampus, Engr. Raymundo S. Moso,
  Engr. Aylmer Ronnel L. Sombilla, Engr. Mel Christian V. Aborde — Electronics
  Engineering

**None of it is verified.** The College's legacy site published no faculty
listing, and the design's copy is not a College record. The entries are carried
verbatim so the page can be built and reviewed, and every one needs confirming
against the Human Resource Office record before publication. Two risks are worth
naming:

- **Post-nominals and licences are regulated representations.** "PCPE",
  "Professional Computer Engineer (CpECB)", "CE", "ECE", "ECT" and "Registered
  Architect" each assert a PRC or equivalent registration. Publishing an
  unverified registration against a named individual is a different kind of
  problem from publishing an unverified accreditation level for a programme.
- **Third-party offices and employers.** "President, Philippine Institute of
  Architects Davao Chapter", "President, SAP Alpha-Davao Chapter",
  "Professional Membership Officer, ICpEP Region XI Chapter", "DevSecOps at
  LuchTech", "Principal Architect, MAGB Architecture and Interior Design", and
  the PIA College of Fellows and UAP memberships name outside organisations and
  attribute positions to named people. Each needs the individual's consent and
  the organisation's agreement, not only the College's.

The screen also carries a stated statement of intent from the Dean, quoted in her
card, and assigns each programme coordinator and department headship. Those are
structural claims about who runs each department and should be confirmed
alongside the roster.

The records live in `src/content/faculty.json`, one entry per person, so the
roster can be corrected without touching the page. A person with no `portrait` is
drawn as a drafting-board monogram: the design supplies photographs for the Dean
and the Architecture coordinator only, and inventing faces for the other thirteen
would be worse than drawing none.

## The curriculum matrix

`/programs` is the design's **"UIC-CEA Academic Programs Offered"** screen. Two
parts of it are numbers rather than wording, and both need a registrar's
confirmation:

| Figure | Stated for |
| --- | --- |
| 198 units, 240 hours | BS Architecture |
| 168 units, 240 hours | BS Civil Engineering |
| 165 units, 300 hours | BS Computer Engineering |
| 170 units, 300 hours | BS Electronics Engineering |

The unit counts and the practicum hours are specific enough to be checked
against the published curriculum, and the comparison matrix repeats all four
side by side. The roadmap rows ("Yr 1 Visual Tech", "Yr 3 Steel, Concrete,
Hydro") and the career-pathway lists are the design's own summary of each degree
rather than an official course sequence.


## Imagery

All sixteen images are remote files on Google's CDN, and **all sixteen are
generated**. None is a photograph of the College. They depict an invented
emblem, eight invented laboratory plates, three invented student projects, two
invented faculty portraits and an invented map plate.

The two faculty portraits are the most sensitive of the sixteen. A generated
face beside a real name reads as a photograph of that person, so both are
labelled as illustrations in their alt text and both are flagged for replacement
in the faculty section above.

They are in place because they are part of the design being adopted and because
there is nothing else available for those slots. **They must be replaced with
the College's own photography before this is published as a record of the
institution.** The emblem is the most urgent: it is the one image a visitor is
most likely to read as the institution's own.

The alt text was written to describe the illustration without asserting that the
scene exists at Bonifacio Campus. The prototype's own alt text claimed it —
"students in safety helmets", "in Bonifacio Campus" — and an accessibility
layer should not state a fact about the real campus that is not true.

All sixteen URLs are in `src/consts.ts` under `IMAGES`, and the loading, decoding
and referrer policy for them live in one place, `src/components/RemoteImage.astro`.
Replacing them is a change to those two files.

## Departures from the design

Recorded so they read as decisions rather than as oversights. Each was a place
the prototype could not work; the alternative was shipping something that looks
functional and is not.

| Design element | What was done | Why |
| --- | --- | --- |
| Programme filter: "All Programs / Licensure Ready / PACUCOA / PTC" | Removed | Both named categories are stated College-wide in the prototype's own copy, so all four programmes carry both and **no tab can narrow the grid**. A control that provably cannot filter is worse than an absent one. |
| School-year strip on Featured Works, and the "All Archives" link | Removed; `/featured-works` is the full set | Only one of the three works states a school year ("Thesis 2026"). A year tab would show one work or nothing, and inventing years for the other two would be fabricating records. |
| "Archives" as a third top-level nav item | Removed | The prototype is a single screen, so the item had no page and no content behind it. |
| All 30-odd `href="#"` links | Replaced with real routes | Taken from the prototype's own `data-path` attributes, so the paths are the ones the design named. |
| Inquiry form behaviour | Composes a `mailto:` to `cea@uic.edu.ph`; no fake success | The prototype intercepted submit, showed "your inquiry has been routed" and reset the form, having sent nothing. A confirmation that fires regardless is worse than none. The visitor sees and sends the message themselves. |
| Footer's newsletter field (inert `type="button"`) | A real form, same `mailto:` | There is no list to subscribe to and no backend. |
| Footer links "Data Privacy Policy / Terms of Use / Campus Directory" | Rendered as plain text, not links | This site publishes none of the three. Inventing policy text for a real university is not a design system's call. |
| Header and nav menus (`group-hover` only) | Real disclosure buttons | `group-hover` is unreachable by keyboard and on touch — the whole "Programs Offered" list could not be opened on a phone. |
| `pt-30` on `main` (not a valid Tailwind class) | `pt-space-header`, 120px | The intent was correct: the fixed header is 40px + 80px. |
| Material Symbols icons | Hand-drawn equivalents in `Icon.astro` | Avoids copying the icon outlines, and matches the site's own stroke register. The mark labels changed from Plus Jakarta Sans to Atkinson, which is what the site serves. |
| Programme badge marks | Kept as the prototype drew them | They are vector and part of the design, so they cost nothing to carry. Only the label face changed. |
| Programme tab bar on `/programs` | Kept, and wired | The tab bar that was dropped from the programme grid reappears on the design's own Academic Programs screen, where it does filter: the tabs are "All Programs (4)" plus the four degrees, and pressing one genuinely leaves that degree's plate. The reason it was removed from the other screen does not apply here. |
| The prototype's `filterPrograms` / `filterDept` inline scripts, which read `event.currentTarget` and assign to a bare `tabs.forEach(tab => tab.className = ...)` | Rewritten against `data-*` attributes, with `aria-pressed` and the `hidden` attribute | The original two had real defects: `event` is not in scope inside a `function` declaration, so the pressed tab never highlighted; and assigning `className` as a string wiped the styling of every tab. Rewritten so the pressed state is announced, and so a filtered-out plate leaves the accessibility tree as well as the layout. |

## Routes

Taken from the prototype's `data-path` values and from the design's screen
names. Eleven pages plus a 404.

The two screens added last are not new routes. The design names them
"Academic Programs Offered" and "Our Pride: Dean & Faculty Directory", which are
the pages that already sat at `/programs` and `/about/our-pride` and which the
design's own navigation, and the legacy Google Sites URLs, already pointed at
those addresses. Porting them onto the existing routes rather than adding two
near-duplicates is why `/programs-offered` and `/about-cea/our-pride` in
`public/_redirects` continue to resolve.

| Route | Source |
| --- | --- |
| `/` | The prototype's full "Programs & Admissions" screen |
| `/programs` | The "UIC-CEA Academic Programs Offered" screen |
| `/programs/bs-{architecture,civil-engineering,computer-engineering,electronics-engineering}` | `data-path` on each card |
| `/about/our-pride` | The "UIC-CEA Our Pride: Dean & Faculty Directory" screen, at the design's own `data-path="our-pride"` |
| `/about/cea-logo-and-seal` | `data-path="cea-logo-and-seal"` |
| `/scholarships-offered` | `data-path="scholarships-offered"` |
| `/featured-works` | Its Featured Works section |
| `/contact-and-inquiries` | `data-path="contact-and-inquiries"` |

`public/_redirects` maps the legacy Google Sites addresses onto these, and also
sends the three legacy routes that have no equivalent here — `/faculty`,
`/downloads`, `/archives` — to the closest real page rather than a dead end.

## Deployment

`CEA_SITE_URL` must be set in the build environment. It is the origin every
canonical tag, `og:url` and sitemap entry is built from. Unset, the site still
builds but emits none of them: a wrong origin gets indexed, a missing one does
not. It is read from the environment rather than written into
`astro.config.mjs` because the same build is served from `cea.kube` in review and
from a Cloudflare Pages domain in production.
