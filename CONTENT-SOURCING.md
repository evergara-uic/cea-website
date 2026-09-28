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

A third section follows, on the events screen, whose single most serious item is
a testimonial attributed to a named student. See **The events and retreats
screen** below.

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


## The events and retreats screen

`/events-and-retreats` is the "UIC-CEA Events, Recreation & Retreats" screen,
the fourth design screen ported. It is the most name-dense of the four after
the faculty directory, and most of what it asserts is an event that either has
not happened or is not on the record.

**The most sensitive item on the site is the testimonial.** The retrospective
gallery quotes a student by name and by guild office — "Krystelle Joy Alcantara,
BS Architecture Graduating Class • CEASO Senator" — in a statement about her own
thesis and her own formation. The design invented the quotation and invented
the attribution. Publishing an invented remark under a named person's degree
and office is a false statement about a real-seeming student, and **it must not
go live until that person has agreed to it in writing.** The same applies to the
count of "over 180 graduating candidates" in the card above it.

Everything else in the section is an assertion about an event, a venue, a person
or a number:

| Claim on the page | Why it needs confirming |
| --- | --- |
| The three featured dates — 18–20 October, 14–16 November, 6–8 December 2025 | Past events. The Student Affairs Office or the Campus Ministry holds the actual calendar. |
| "St. Michael Retreat House, Eden, Toril" | A named third-party venue, with what sounds like a booking. Confirm the house exists under that name and that the College has used it. |
| "Samal Island Nature Reserve", "UIC Bonifacio Gymnasium & Grounds", "Paquibato Child Development Center", "Bonifacio Quadrangle & Social Hall", "UIC Main Chapel", "UIC Bonifacio Main Auditorium" | Six venue bookings, four of them outside the campus. |
| "CEASO Wolves Fest 2025" and the four tournament brackets | A guild competition with a name, a date range and a fixture list. |
| "Project 'Lantaw Komunidad'", led by Engr. Johndel Quiño as Coordinator for Community Development Services | A named outreach project with a named coordinator and a named role, and a claim that it deploys solar kits, water filtration and bamboo daycares. |
| The seven matrix rows with their dates, organisers and time spans | Each names a guild, a department or a committee as the party responsible. |
| "BS Civil Engineering clinched the 2024 Overall Athletic Trophy" | A result attributed to a named degree. |
| "1,240 Participants" and "Over 180 graduating candidates" | Headline attendance figures. |
| `cea.events@uic.edu.ph` | A mailbox the design invented. It is the form's recipient on this page, and the College's own `cea@uic.edu.ph` is printed beside it everywhere, so nothing here is the only way to reach the College. **Confirm the address before launch; if it does not exist, the form falls back to the general mailbox.** |
| Treshia Loraine Vitor, CEASO Executive Coordinator & Administrative Assistant | A named member of staff in a named office, with a direct line and a floor. |
| "Proposals and retreat waivers returned within 48 operational hours" | A service commitment the College would then be held to. |
| "Mandatory for Graduating Batch" on the retreat | An academic requirement. A mandatory formation requirement for a graduating class is a registrar's decision. |
| The filter pills' counts — "All Activities (11)", "Community Extension & Outreach (4)" | **These do not agree with the page.** The design lists seven events, of which two are community extension. The pills are reproduced as written; the live count beside the search field is computed from the rows and reads 7. Either the numbers are wrong or the list is partial, and the Student Affairs Office should say which. |
| The reference number in the prototype's success panel, `#UIC-EVT-2025` | Not carried over. A `mailto:` has no reference number to give. |

The seven matrix rows live in `src/content/events.json` and are the editable
surface for this screen. The three spotlights, the four pillars, the gallery and
the form's option lists are named in the page's frontmatter, because they are
three-and-four-item presentational blocks rather than a repeating record type.

## The College's supplied photographs and video

The College supplied 135 photographs in five sets and four event videos, 570 MB
in total, dropped into `public/`. They are now on the events page. What follows
is what had to be decided to put them there, and what is still open.

### The videos could not have been deployed at all

Cloudflare Pages rejects any single file over 25 MiB. All four videos exceeded
it — by 27.8, 114.3, 151.6 and 166.6 MB — so the deploy failed before anything
else could be diagnosed. This was not a matter of tidying up a heavy page; the
site did not build.

| Clip | Supplied | Now | Why it was that big |
| --- | --- | --- | --- |
| CEA Promotional Video | 27.8 MB, 720p30, 1.1 Mb/s | 13.9 MB | Already close to the limit |
| EA Program — AVP | 166.6 MB, 1080**p60**, 9.5 Mb/s | 13.2 MB | 60 fps phone capture |
| CEA Fair | 114.3 MB, 1080**p60**, 10.1 Mb/s | 13.1 MB | 60 fps phone capture |
| CEA Fair — full recording | 151.6 MB, 1080p24, 10.3 Mb/s | 14.4 MB | Very high bitrate |

Two of the three 1080p clips are 59.94 fps, which is a phone's high-frame-rate
mode. Halving to 30 removes about half the data with no perceptible loss on
event footage. The rest is a per-clip rate cap computed from each clip's own
duration, and a step down to 1600x900, because 1080p at 1.0 Mb/s looks worse
than 900p at 1.0 Mb/s. The 24 fps recording was left at 24 fps; re-encoding it
to 30 would duplicate frames and spend bitrate on nothing.

**The encodings are the only thing here that is derived rather than supplied.**
Nothing in the footage was cut. If a clip is trimmed in the future, the
transcode has to be redone from `media/source/`, not from the output.

### The videos are expected to move to YouTube

The College intends to upload these four recordings to YouTube and link to them
from the site, which is very likely the better outcome: 51 MB of hosted video on
a college site is a lot to ask of a visitor on a phone, and YouTube handles
mobile playback, captions, bandwidth and the embed's privacy options properly.

Until that happens the page plays the four files itself, because that is what
deployed. The section is driven by one `VIDEOS` array in
`src/pages/events-and-retreats.astro`, so switching it over is a change to that
array and to `EventVideo.astro` — one component, one list. The photographs are
not affected either way.

Two things worth deciding when the YouTube links arrive:

- **Whether to embed or link.** An embed plays on the page and costs the visitor
  nothing until they press play, but loads YouTube's player and its tracking.
  A link is lighter and loses the video from the page entirely. For a College
  site, a link is the safer default and a thumbnail plus a link is the usual
  compromise.
- **Whether the recordings need captions.** Auto-captions on four recordings of
  a student-led event are usually wrong enough to be embarrassing, and they are
  also an accessibility failure. If they are not watched and corrected, the
  embedded version should be muted by default or not embedded at all.

Once YouTube has them, `media/source/` and `src/assets/media/video/` can both be
deleted and the 570 MB of originals stops being the last copy of anything.

The photographs went through the same problem by another route: 38 of them are
1920x1080 **PNG** files of photographs, 60.6 MB, because a photograph saved as
PNG is roughly nine times the size of the same photograph as WebP. They are now
WebP at two widths, 480 for the grid and 1600 for the full-size link, 108.4 MB
to 21.5 MB.

### What the photographs are captioned with, and what they are not

The five sets arrived as folders with no captions, no dates and no notes:

| Folder | Photographs |
| --- | --- |
| `2024-2025 Research` | 38 |
| `Freshmen Orientation 2026` | 18 |
| `Freshmen Tour 2026` | 19 |
| `Research Forum 2026` | 50 |
| `Testimonies` | 10 |

**The folder name is the only description any of them has, so the folder name
is the only description used.** No photograph is captioned with a venue, a
headcount, an activity or a person's name, because no file states any of those.
The two gallery cards that used to sit on this page carried exactly that kind of
caption — "Eden Mountain Chapel", "Bonifacio Gym", "1,240 Participants", "Over
180 graduating candidates" — and none of it was ever sourced. It has been
removed along with the illustrations that accompanied it.

**The three spotlights still carry their generated illustrations**, and this is
a deliberate decision rather than an oversight. They are the only three images
on the site left uncaptioned by this rule, and they are the illustrations for
the 2025 retreat, the 2025 sportsfest and the 2025 community extension. Not one
of the 135 photographs is of any of those three events. Putting a Freshmen
Orientation 2026 photograph under a heading about the Eden retreat would be the
same false caption in the opposite direction, so those three cards keep images
that are already labelled as illustrations. When photography of those events
exists, the spotlights are where it goes.

### The alt text is a known gap and needs someone who can see the photographs

All 135 photographs have the alt text `"Photograph N of M from <event>"`. That is
true and it says nothing about what is in the frame. It is what is there because
nobody has yet been able to describe these photographs, and **inventing
descriptions of real students and real events is worse than admitting the gap.**

Someone who can see the photographs needs to write alt text for:

1. `2024-2025 Research` — 38
2. `Freshmen Orientation 2026` — 18
3. `Freshmen Tour 2026` — 19
4. `Research Forum 2026` — 50
5. `Testimonies` — 10

The filenames are numbered in the College's own order, so "N of M" matches what
the person who took the photographs would recognise. The same gap applies to the
four poster frames and to what is in the videos.

### The testimonials: photographs shown, quotation still not cleared

The 10 photographs in `Testimonies` show identifiable students and are now on
the page. The College was asked to confirm consent and **has not yet done so.**
The College's answer to date has been to publish the photographs and keep the
warning standing, so that is what has happened — but the photographs themselves
are a consent question, not only the quotation.

**The fabricated testimonial is unchanged and still must not go live.** See the
events section above. Nothing in the new media bears on it: a photograph of a
real student does not make an invented quotation from that student's mouth
publishable.

### The Intramurals, 7-9 October

This is the one real, dated event on the page, and it sits in its own section
above the three spotlights. The College supplied a name and a date and nothing
else, so **the venue, the programme and the eligibility are blank**, and the
card says so where a visitor would look for them rather than filling the gaps.

**The year is inferred, not supplied.** The College described it as upcoming,
and this was written on 28 September 2026, so an October still to come is
October 2026. That is a reading of the date, and it is the one date on this page
worth checking before the page goes live. The card's photograph is the design's
existing sports illustration, reused, because no supplied photograph is of the
Intramurals.

To fill it in, edit `NEXT_EVENT` in `src/pages/events-and-retreats.astro`. The
component renders placeholder text only while a field is empty, so filling a
field in is all that is needed; nothing has to be taken out afterwards.

## Imagery

All nineteen images are remote files on Google's CDN, and **all nineteen are
generated**. None is a photograph of the College. They depict an invented
emblem, eight invented laboratory plates, three invented student projects, two
invented faculty portraits, three invented event scenes and an invented map
plate.

The two faculty portraits are the most sensitive of the nineteen, and the three
event scenes are next: a generated crowd at a "campus recreation day" or a
"community extension in Davao" reads as a photograph of a real CEA activity,
which is precisely what these screens would be cited as evidence of. All five
are labelled as illustrations in their alt text, and all five must be replaced
with the College's own photography before publication.

They are in place because they are part of the design being adopted and because
there is nothing else available for those slots. **They must be replaced with
the College's own photography before this is published as a record of the
institution.** The emblem was the most urgent of the nineteen, being the one
image a visitor is most likely to read as the institution's own; that one is
now replaced with the College's actual logo.

The College's own photography has since arrived — 135 photographs and four
videos — and the events page now uses it for its video section, its photo
archive and two of its three retrospective gallery cards. **The three event
scenes in the spotlight row are the illustrations that remain**, because no
supplied photograph is of any of the three events they stand in for. See
"The College's supplied photographs and video" above.

The alt text was written to describe the illustration without asserting that the
scene exists at Bonifacio Campus. The prototype's own alt text claimed it —
"students in safety helmets", "in Bonifacio Campus" — and an accessibility
layer should not state a fact about the real campus that is not true.

All nineteen URLs are in `src/consts.ts` under `IMAGES`, and the loading, decoding
and referrer policy for them live in one place, `src/components/RemoteImage.astro`.
Replacing them is a change to those two files.

### The College's own marks, which are now real

Five logo files were supplied and are now in use. They are the first real
institutional assets on the site.

| File | Used for |
| :-- | :-- |
| `CEA logo.png` | the hero mark on `/about/cea-logo-and-seal` |
| `architect_logo.png` | the BS Architecture mark |
| `civilEngineer_logo.webp` | the BS Civil Engineering mark |
| `ICPEP.SE_logo.png` | the BS Computer Engineering mark |
| `electronics_engineering_logo.png` | the BS Electronics Engineering mark |

This closes the gap flagged above. `/about/cea-logo-and-seal` previously showed
the generated emblem — the one image on the site most likely to be read as the
institution's own identity — and now shows the College's actual lockup. The
generated emblem remains in `IMAGES.emblem` and is still drawn in the header and
the footer, where it is a decorative motif rather than a claim about the seal.

**Three things are not yet settled and one of them needs a decision.**

**1. Vector originals should be requested.** The five files are raster, and
three of them are not line art at all. They were measured before being used:
rendering a Potrace of each back to a raster and diffing it against its own
source gives a mean absolute error per pixel out of 255.

| File | Distinct colours | Saturation | MAE | Pixels substantially wrong |
| :-- | --: | --: | --: | --: |
| `electronics_engineering_logo.png` | 32 | 0.000 | 1.2 | 1.3% |
| `CEA logo.png` | 135 | 0.147 | 22.1 | 21.3% |
| `architect_logo.png` | 456 | 0.026 | 37.9 | 44.5% |
| `civilEngineer_logo.webp` | 2266 | 0.194 | 44.2 | 56.2% |
| `ICPEP.SE_logo.png` | 4148 | 0.284 | 47.8 | 53.1% |

Only the electronics mark is flat line art, and it traces to within 1.2/255. The
other three are tonal or photographic, where Potrace has to invent the greys and
over half the pixels come out substantially wrong. A traced photograph is a
cartoon of the College's own mark, so **the logos are served as raster**, sized
to the 56 CSS pixels they actually occupy. Ask the College for the AI, EPS or
SVG originals; logos are made in vector tools and these are exports. When they
arrive, `scripts/build-logo-assets.mjs` is the only thing that has to change.

**2. The Civil mark carries a black field of its own.** `civilEngineer_logo.webp`
has no alpha channel and its corners are `#000000`. This was confirmed to be part
of the artwork rather than an artefact of how it was saved, so it is left alone
and `ProgramMark.astro` gives that one mark a dark plate — a near-black disc the
same colour as the artwork, so the square's edge disappears and the plate reads
as a circle like the other three. If that judgement is wrong, the field can be
knocked out to transparency instead, but that needs care: the mark has dark areas
of its own and a naive white-key would take them with it.

**3. Alt text is derived, not verified.** The mark alt reads `"<badgeLabel>
logo"` — "PICE UIC logo", "UAPSA UIC logo", "ICPEP.SE UIC logo", "ECES • EST. 1992
logo". That states the association and asserts nothing about what the artwork
depicts, which is deliberate: these were supplied as files and nothing is
documented about what each one shows. If any mark contains text the site should
be transcribing, or a seal with a date or founding year on it, that has to be
read off the artwork by a person and the alt text written to match.

**Not verified: the apparent size difference between the marks.** Empty
transparent margin is cropped in the build, which is a crop and not a rescale.
What remains is that the artwork itself fills very different fractions of the
original canvas — architecture 78%, electronics 84%, civil and ICpEP 99% — so the
Civil and ICpEP marks will sit larger inside their 80-pixel plates than the other
two. Equalising them means choosing relative visual weights, which is a design
judgement, so it has been left alone pending a look at the rendered page.


### The deleted legacy media, and why there is nothing to restore

There was a real photograph library once, and the reason this site carries no
local images is a decision rather than an accident. Recorded here because the
code that did it is gone and this is the only account of it.

The College's previous site was a **Google Sites** export at
`sites.google.com/uic.edu.ph/collegeofengineeringandarchi`, linked from the
University site and from Facebook. Migrating it took three scrapers and two
asset passes, and it did not go well:

- The image CDN served the site from rotating opaque ids, so the first pass had
  to name every file by **position on the page** rather than by anything
  meaningful, and matching the export's real filenames back to those positional
  names needed a grayscale-thumbnail comparison, because the export held
  originals while the live site had served resized copies — so neither
  filenames nor byte hashes could pair them up.
- That first pass used a thread pool, and the CDN **rate-limits by request rate
  rather than by total volume**, so concurrency bought nothing but 403s. **52 of
  170 images were lost**, including every photograph from the 2024-2025 school
  year. A single-threaded retry pass recovered some of them.
- The CDN is now closed entirely: every direct fetch of `sitesv-images-rt`
  returns **403**. The originals cannot be re-obtained from the source at all.

Given that, the library was not trustworthy enough to build a new site on — a
site whose photographs are 30% missing, misnamed and unattributable is worse
than one that is honestly illustrated. The local media and the legacy copy were
deleted, and the design's own imagery was used in their place, labelled as
illustration.

So: **there is no recoverable original in this repository, and no way to fetch
one.** Reinstating the College's real photography means obtaining the files from
the College itself — a Takeout archive, the original Google Drive, or a
photographer's masters — not re-running anything that was here before.

The migration scripts (`migrate-assets.py`, `rebuild-assets.py`,
`retry-assets.py`, `match-assets.mjs`, `prepare-logos.mjs`, `encode-video.mjs`)
and the 121 KB `assets-manifest.json` were removed on that basis. They cannot
run — their input directories are gone and the CDN they read is closed — and two
of them were the only reason the `sharp` native binary was a production
dependency, which Cloudflare would have downloaded on every build. This
paragraph is the record of what they did.

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
| "Events & Retreats" as a nav menu of four pages | A single nav link to the one page that exists | The design's Events screen names four children — All Events & Retreats, Engineering & Architecture Week, Spiritual Formation Retreats, Archives — and supplies a screen for one of them. The other three are redirected to it rather than left as menu entries with nothing behind them. |
| The prototype's `showSuccessNotice()` on the events form, which showed "Inquiry Transmitted to CEASO Secretariat! An acknowledgment email has been routed to your UIC address with reference ID #UIC-EVT-2025" | Composes a `mailto:` to the office and says what actually happened | Same reason as the Dean's Office form. There is no server, no transmission and no reference number, and a panel claiming all three is the kind of thing that gets quoted back at the College. |
| The three spotlights' document buttons — "Download Schedule PDF", "Download Schedule PDF", "View Extension Project Brief" | Written out as text: not published, ask the office | The design offers a file for download and builds no file. The same treatment the footer gives its three policy links. |
| The events matrix's per-row "Details" button | A link that asks the office about that event | The prototype's `<button>` has no handler and no panel behind it. Every field the missing panel would have held is already on the row. |
| The hero's inline SVG `<pattern>` CAD grid and its two gradient glow spheres | A CSS background grid and two blurred discs | Identical result, and the grid is then the same one the rest of the site uses rather than a second one. |

## Routes

Taken from the prototype's `data-path` values and from the design's screen
names. Twelve pages plus a 404.

The screens added last are not new routes, except this one. The design names
them "Academic Programs Offered" and "Our Pride: Dean & Faculty Directory",
which are the pages that already sat at `/programs` and `/about/our-pride` and
which the design's own navigation, and the legacy Google Sites URLs, already
pointed at those addresses. Porting them onto the existing routes rather than
adding two near-duplicates is why `/programs-offered` and `/about-cea/our-pride`
in `public/_redirects` continue to resolve. "Events & Retreats" is the first
genuinely new route the design has asked for, at the design's own
`data-path="events-and-retreats"`.

| Route | Source |
| --- | --- |
| `/` | The prototype's full "Programs & Admissions" screen |
| `/programs` | The "UIC-CEA Academic Programs Offered" screen |
| `/programs/bs-{architecture,civil-engineering,computer-engineering,electronics-engineering}` | `data-path` on each card |
| `/about/our-pride` | The "UIC-CEA Our Pride: Dean & Faculty Directory" screen, at the design's own `data-path="our-pride"` |
| `/about/cea-logo-and-seal` | `data-path="cea-logo-and-seal"` |
| `/scholarships-offered` | `data-path="scholarships-offered"` |
| `/featured-works` | Its Featured Works section |
| `/events-and-retreats` | The "UIC-CEA Events, Recreation & Retreats" screen, at `data-path="events-and-retreats"` |
| `/contact-and-inquiries` | `data-path="contact-and-inquiries"` |

`public/_redirects` maps the legacy Google Sites addresses onto these, sends the
three legacy routes that have no equivalent here — `/faculty`, `/downloads`,
`/archives` — to the closest real page rather than a dead end, and sends the two
undesigned Events siblings — `/engineering-week` and
`/spiritual-formation-retreats` — to the one Events page there is.

No route gets a redirect to itself. A rule whose destination is its own source
answers every request with a redirect to the address the visitor just asked for,
and Cloudflare matches those rules before it looks for a file, so the page
becomes unreachable. Three such rules shipped once and were caught only by
reading the deployed domain. `scripts/verify-dist.py` now fails on them.

## Deployment

`CEA_SITE_URL` must be set in the build environment. It is the origin every
canonical tag, `og:url` and sitemap entry is built from. Unset, the site still
builds but emits none of them: a wrong origin gets indexed, a missing one does
not. It is read from the environment rather than written into
`astro.config.mjs` because the same build is served from `cea.kube` in review and
from a Cloudflare Pages domain in production. A value that is not an absolute
http(s) URL fails the build outright.

`NODE_VERSION` must be set in the Cloudflare Pages dashboard, to `22`. The build
image's own default selects the version, and `engines` in `package.json` is not
what it reads.

`public/_redirects` and `public/_headers` are read by Cloudflare and by nothing
else. The local preview serves `dist/` through Caddy with `try_files`, so a
defect in either file is invisible at `http://cea.kube` and total in production.
There is no Content-Security-Policy, and one should not be added without
checking what the pages actually need inline: every image is a remote URL applied
through an inline `style="background-image: …"` attribute, which a strict
`style-src` would break.

The site deploys to **Cloudflare Pages** as a plain static build, with **no
adapter** and no `wrangler.jsonc`. Two failures came from getting that wrong,
and both are recorded here because the second is invisible locally.

The first attempt configured the deploy command as `npx wrangler deploy`. That
is the Cloudflare **Workers** pipeline. Wrangler found no Wrangler config,
auto-configured, and concluded the project was an Astro *server* application, so
it ran `astro add cloudflare` inside the build container. That rewrote
`astro.config.mjs` to add `adapter: cloudflare()`, added `@astrojs/cloudflare`
and `wrangler` as runtime dependencies, wrote its own `wrangler.jsonc`, and
reindented the config file to four spaces — none of it committed, all of it
altering the build. It moved the output from `dist/_astro` into
`dist/client/_astro`, which broke `scripts/prune-unused-assets.mjs` with an
ENOENT, and it provisioned an `IMAGES` binding and a `SESSION` KV namespace that
this site never uses.

Astro's documentation on the Cloudflare adapter opens by saying the adapter is
unnecessary for a static site builder, and its changelog records that Cloudflare
**Pages support was removed from the adapter** in v13. An adapter build and a
Pages deploy are therefore mutually exclusive. Astro's Cloudflare *deploy* guide
now documents Workers only; that reflects where the documentation moved, not
that Pages stopped working. Pages still reads `public/_redirects` and
`public/_headers`, which is what this site relies on for its legacy Google
Sites paths and its cache headers.

No domain is required to deploy. Pages assigns a `pages.dev` subdomain, and
`CEA_SITE_URL` is set to it. When a domain is attached later that variable must
be changed and the site redeployed, or the canonical tags and the sitemap will
keep naming the `pages.dev` address as the site's own origin.
