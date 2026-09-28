# College of Engineering and Architecture — website

The public website for UIC's College of Engineering and Architecture. A static
Astro site: no CMS, no server, no database, no client framework. The build
produces thirteen HTML files, one stylesheet, three self-hosted font files and a
sitemap, totalling under a megabyte.

Two things about this repository that are not obvious from the code:

**Read [`CONTENT-SOURCING.md`](CONTENT-SOURCING.md) before publishing.** Most of
the copy and every photograph came from a design prototype, not from the
College. The photographs are AI-generated illustrations and are labelled as
such. Some of the prototype's claims contradict what the College is actually
accredited for. That file lists every one of them and what has to happen to
each.

**`_redirects` is inert locally.** Cloudflare is the only thing that reads it;
the local preview serves `dist/` through Caddy with `try_files`. A redirect
loop in that file is invisible at `http://cea.kube` and fatal in production.
`scripts/verify-dist.py` checks for it.

## Deploying to Cloudflare Pages

This is a **static** Astro site on **Cloudflare Pages**. No adapter, no Worker,
no server runtime. Pages serves `dist/` as files, which is all this site needs.

Connect the repository under **Workers & Pages → Create → Pages → Connect to
Git**, then set:

| Setting                | Value                      |
| :--------------------- | :------------------------- |
| Framework preset       | `Astro`                    |
| Build command          | `npm run build`            |
| Build output directory | `dist`                     |
| Root directory         | repository root            |

**Leave the deploy command empty.** Pages has none. It uploads `dist/` itself
after the build succeeds.

### Do not point a Pages project at `wrangler deploy`

A previous deploy was configured with `npx wrangler deploy` as the deploy
command. That is the **Workers** pipeline, and on a static site it fails:

1. Wrangler sees no Wrangler config, so it auto-configures, decides the project
   is an Astro *server* app, and runs `astro add cloudflare` **inside the
   build container**. That rewrites `astro.config.mjs` to add
   `adapter: cloudflare()`, adds `@astrojs/cloudflare` and `wrangler` as runtime
   dependencies, writes its own `wrangler.jsonc`, and reindents the config file
   — none of it committed, all of it changing the build.
2. The adapter moves the output from `dist/_astro` to `dist/client/_astro`,
   which broke the post-build prune step with `ENOENT`.
3. It provisions an `IMAGES` binding and a `SESSION` KV namespace that this site
   never uses.

Astro's documentation on that adapter opens with: *"If you're using Astro as a
static site builder, you don't need an adapter."* The same page also records that
Cloudflare **Pages support was removed from the adapter** in v13, so the two
cannot be combined. Astro's deploy guide now documents Workers only — that is
not a statement that Pages stopped working, it is that the documentation moved.
Pages still reads `_redirects` and `_headers` exactly as this site expects.

`npm run build` is `node scripts/build-logo-assets.mjs && astro build && node
scripts/prune-unused-assets.mjs`. The same command produces the same output on a
laptop, in the pod, and in Cloudflare.

Add these under **Settings → Environment variables → Production and Preview**:

| Variable        | Value                | Required |
| :-------------- | :------------------- | :------- |
| `CEA_SITE_URL`  | the site URL         | yes      |
| `NODE_VERSION`  | `22`                 | yes      |

### `CEA_SITE_URL` before you own a domain

You do not need a domain to deploy. Pages assigns every project a free
subdomain on `pages.dev`, and that is a working URL:

```text
https://<your-project-name>.pages.dev
```

Set `CEA_SITE_URL` to that, with no trailing slash. Every canonical tag, every
`og:url` and every sitemap entry is built from it, so the site is fully correct
on a `pages.dev` address.

When a domain is attached later, **change this variable and redeploy.** It is
the one setting that has to be revisited, and forgetting it is the failure mode
worth naming: the site would serve from `cea.edu.ph` while every canonical tag
and sitemap entry still said `pages.dev`, telling search engines the live
address is the wrong one. Two clicks in the dashboard, then a fresh deploy.

A missing value is not fatal — the build succeeds and emits no canonical tags,
no `og:url` and no sitemap, which is deliberate, because a wrong origin gets
indexed and a missing one does not. A non-absolute value fails the build
outright.

`NODE_VERSION` has to be set in the dashboard. The build image ships its own
default Node, that default has changed over time, and `engines` in
`package.json` is not what selects it. Astro 7 needs Node 20.19, 22.12 or 24;
`.node-version` is committed as a second signal for local and CI use.

Neither value belongs in the repository. `astro.config.mjs` reads the origin
from the environment precisely so that one build can be served from `cea.kube`
in review and from a Pages address in production without a wrong absolute URL
reaching the page.

### `sharp` is a real dependency, and still should not be removed

`scripts/build-logo-assets.mjs` imports `sharp` directly, so it is declared in
`dependencies` rather than arriving as an optional dependency of `astro`. It
resizes and re-encodes the five logo files, which is the only image processing
this project does — nothing in `src/` runs an image through it at build time.

`sharp` is also an *optional* dependency of `astro`, which uses it for image
optimisation, and the two are the same install. Because every photograph on the
site is a remote URL applied through an inline `style` attribute, Astro never
calls into it for anything else, and the build completes identically with the
package removed.

`npm ci --omit=optional` does skip it, along with 18 MB of libvips, but it also
skips Rollup's and esbuild's native binaries and the build then fails. So do not
set that. Nothing from `node_modules` is ever served, because the deployed output
is HTML, one stylesheet and five logo files.

### After the first deploy

Replace `<site>` below with whatever you set `CEA_SITE_URL` to. These are
`curl -sI` checks, and the fourth is the one that catches the failure this
project is most exposed to.

- `https://<site>/sitemap-index.xml` returns 200. If it 404s, the production
  build ran without `CEA_SITE_URL`.
- `https://<site>/events` returns **301** to `/events-and-retreats/`, proving
  `_redirects` was copied and is being honoured.
- `https://<site>/_astro/<the-css-file>.css` returns
  `Cache-Control: public, max-age=31536000, immutable`, proving `_headers` was
  copied. The filename is fingerprinted, so read it out of the homepage source.
- `curl -s https://<site>/ | grep canonical` shows your `CEA_SITE_URL` and not
  `pages.dev`, if you have since attached a domain.

Also worth a look by hand: the nav at a real window width, and the
`/events-and-retreats` page. See [`CONTENT-SOURCING.md`](CONTENT-SOURCING.md)
before treating any of it as publishable.

## Local development

There is no Node on the development host; the build runs inside the Kubernetes
pod, where the workspace is mounted at `/app`.

```sh
npm run dev       # dev server on :4321
npm run build     # static output to ./dist/
npm run preview   # serve ./dist locally
```

`astro.config.mjs` pins `vite.server.allowedHosts` to `cea.kube` and points HMR
at the Traefik edge, so a request arriving with any other Host header is
refused. That block is dev-only and has no effect on the deployed build, which
is static files.

## Checks

Both scripts run against `dist/`, so build first. Both exit non-zero on
failure, so they can gate a deploy.

| Script                          | What it catches                                                            |
| :------------------------------ | :------------------------------------------------------------------------- |
| `python3 scripts/verify-dist.py`   | Broken internal links, missing assets, redirect loops, dead redirect targets |
| `python3 scripts/verify-classes.py` | Classes the pages apply for which the stylesheet emits no rule              |

`verify-classes.py` exists because Astro and Tailwind both fail silently on a
class they do not recognise: the markup keeps the name, the build succeeds, and
the rule is simply never generated. That is not hypothetical — this site
declared its spacing scale as `--space-lg`, which is not a Tailwind namespace,
so every `p-space-lg`, `gap-space-lg` and `px-space-lg` resolved to nothing and
every page gutter and section pad on the site collapsed to zero. The tokens are
now `--spacing-space-*`, which keeps the utility names identical while putting
them in a namespace Tailwind generates from.

Neither script can compare CSS specificity. A rule that loses a cascade to a
rule of equal name and higher weight still exists, still satisfies both checks,
and still renders nothing. Two such bugs have shipped from this codebase — the
nav dropdowns and `.reveal` — and both were found by a person looking at the
site. Treat any report of missing or blank content as a cascade question first.

## Where to edit things

| To change                                    | Edit                        |
| :------------------------------------------- | :-------------------------- |
| Page copy: programmes, works, faculty, events | `src/content/*.json`       |
| Navigation, contact details, imagery, dates   | `src/consts.ts`            |
| A programme's logo                          | `logos/`, then `npm run logos` |
| A glyph                                      | `src/components/Icon.astro` |
| A section's layout                           | the `.astro` file in `src/pages/` |
| Type scale, colour, spacing tokens            | `src/styles/global.css`    |

The JSON files are Astro content collections, validated by schemas in
`src/content.config.ts`. A typo in a field name fails the build rather than
rendering an empty card.

## Repository layout

```text
logos/               the College's supplied logo files — the source of truth,
                     deliberately outside public/ so they are never deployed
media/source/        the College's supplied event media: 135 photographs and
                     4 videos, 570 MB, also outside public/ so it is never
                     deployed as-is
src/
  assets/fonts/     Fraunces and Atkinson, self-hosted and subset-free
  assets/logos/     the processed logo WebPs; generated, do not hand-edit
  assets/media/     the processed event photographs and videos; generated, do
                    not hand-edit
  components/       ~28 .astro components; Icon.astro holds every inline SVG glyph
  content/          programs.json, works.json, faculty.json, events.json
  layouts/          Base.astro — the document shell
  pages/            the thirteen routes
  styles/           global.css — the token layer and the component rules
public/
  _redirects        legacy Google Sites paths, mapped to current routes
  _headers          cache and security headers
scripts/
  build-logo-assets.mjs   runs before the build; sizes the logos in logos/
  build-media-assets.mjs  run by hand, NOT in the build; see "The event media"
  verify-classes.py       classes the pages apply with no matching rule
  verify-dist.py          broken links, redirect loops, dead redirect targets
  prune-unused-assets.mjs runs after the build; drops unused _astro output
Dockerfile.static   static image used by the local k8s preview
Caddyfile           serves ./dist for that preview
```

There is no `wrangler.jsonc` and that is deliberate. Wrangler is the Workers
tool; Pages does not read it. Its presence would only invite someone to set
`npx wrangler deploy` as the deploy command, which is what broke the first
deploy.

`src/assets/` holds the fonts, the processed logos and the processed event
media. The remaining eighteen images are remote URLs declared in
`src/consts.ts`, rendered through `RemoteImage.astro`, and carry alt text that
describes them as illustrations.

## The event media

`media/source/` holds the 570 MB the College supplied: 135 photographs in five
sets and four event videos. `npm run media` processes them into
`src/assets/media/`. **Never hand-edit anything under `src/assets/media/` — it
is regenerated, and only the originals in `media/source/` are the source of
truth.**

This does **not** run in `npm run build`, unlike the logos. Transcoding 570 MB of
source takes several minutes, and Cloudflare Pages times a build out at 20
minutes. The output is committed instead, so CI never needs ffmpeg and never
does the work. The logo script runs at build time because it is five files and
about a second of work; this is a different scale of job and is kept out.

| | |
| --- | --- |
| `npm run media` | photographs only |
| `npm run media -- --video` | also transcodes the video, and needs ffmpeg on `PATH` |
| `FFMPEG=/path/to/ffmpeg npm run media -- --video` | ffmpeg is not on `PATH` |

ffmpeg is deliberately not a dependency. It is a large binary, it is needed
once by hand rather than on every build, and adding it to `package.json` would
put 70 MB into every Cloudflare build to do nothing.

**`media/source/` is not committed**, and this is deliberate. Cloudflare Pages
clones the whole repository on every build, and the build only ever needs the
processed output. Committing both would make the repo about 650 MB and make
every build pay to clone 570 MB it never reads. The originals stay on the
machine that received them and the College has its own copies; re-transcoding
needs them re-supplied. The videos are intended to move to YouTube, which would
make the video originals the only genuinely redundant thing in the directory.

**The video transcode is not optional housekeeping — it is what makes the site
deployable.** Cloudflare Pages rejects any single file over 25 MiB, and all four
supplied videos exceeded it, by 27.8 to 166.6 MB. The 460 MB of source becomes
51 MB of MP4, all four under the limit.

The four videos are expected to be replaced by YouTube links once the College
has uploaded them. Until then the page plays the files itself. The section is
driven by one `VIDEOS` array in `src/pages/events-and-retreats.astro`, so the
switch is a change to that array and to `src/components/EventVideo.astro` — one
list, one component.

Both the photographs and the videos are referenced from
`src/pages/events-and-retreats.astro` through `import.meta.glob`, so they are
fingerprinted and cached like any other asset. Adding a new folder to
`media/source/` and running `npm run media` is enough to have it appear; add the
set to `PHOTO_SETS` in that page as well.

## The logos

`logos/` holds the five files the College supplied, unmodified, as the source of
truth. `npm run build` runs `scripts/build-logo-assets.mjs` first, which writes
WebPs into `src/assets/logos/`. **Never hand-edit anything in
`src/assets/logos/` — it is regenerated, and only the originals in `logos/`
should be changed.**

Two things about that script are worth knowing before you touch it.

It **crops empty margin** rather than rescaling. The originals pad very
differently — the architecture mark's ink starts 6% in and stops at 84%, the
Civil mark is edge to edge — so without the crop the padded marks render visibly
smaller inside the same 80-pixel plate. It does not equalise what is left,
because that is a judgement about relative visual weight rather than a crop.

It does **not** vectorise, and that was measured rather than assumed. Rendering a
Potrace of each logo back to a raster and diffing it against its own source
gives a mean absolute error out of 255: the electronics mark, which is the only
one that is flat line art, traces to within 1.2; the other three sit between 22
and 48, with over half their pixels substantially wrong. A traced photograph is a
cartoon of the College's own mark. If the College supplies AI, EPS or SVG
originals, this script is the only thing that needs to change.

Net effect: 5,614 KB of source becomes 191 KB of WebP, a 97% reduction, and the
architecture mark goes from 4,274 KB to 19 KB.


## Stack

Astro 7, Tailwind CSS 4 through the Vite plugin, TypeScript in `astro check`
mode, and vanilla JS in the pages. No hydration framework, no adapter, and no
server runtime, so there is no client bundle to download beyond the browser's
own and no Worker code to execute.
