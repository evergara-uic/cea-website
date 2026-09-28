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

`npm run build` is `astro build && node scripts/prune-unused-assets.mjs`. The same
command produces the same output on a laptop, in the pod, and in Cloudflare.

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

### `sharp` is still installed, and that is not a mistake

`sharp` is not a dependency of this project. It is an *optional* dependency of
`astro` itself, which uses it for image optimisation. Because this site has no
local images — every photograph is a remote URL applied through an inline
`style` attribute — Astro never calls into it, and the build completes
identically with the package removed.

`npm ci --omit=optional` does skip it, along with 18 MB of libvips, but it also
skips Rollup's and esbuild's native binaries and the build then fails. So do not
set that. The install is about 160 MB either way, and it is build time only:
nothing from `node_modules` is served, because the deployed output is HTML, one
stylesheet and three font files.

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
| A glyph                                      | `src/components/Icon.astro` |
| A section's layout                           | the `.astro` file in `src/pages/` |
| Type scale, colour, spacing tokens            | `src/styles/global.css`    |

The JSON files are Astro content collections, validated by schemas in
`src/content.config.ts`. A typo in a field name fails the build rather than
rendering an empty card.

## Repository layout

```text
src/
  assets/fonts/     Fraunces and Atkinson, self-hosted and subset-free
  components/       ~25 .astro components; Icon.astro holds every inline SVG glyph
  content/          programs.json, works.json, faculty.json, events.json
  layouts/          Base.astro — the document shell
  pages/            the thirteen routes
  styles/           global.css — the token layer and the component rules
public/
  _redirects        legacy Google Sites paths, mapped to current routes
  _headers          cache and security headers
scripts/
  verify-classes.py        classes the pages apply with no matching rule
  verify-dist.py           broken links, redirect loops, dead redirect targets
  prune-unused-assets.mjs  runs after the build; drops unused _astro output
Dockerfile.static   static image used by the local k8s preview
Caddyfile           serves ./dist for that preview
```

There is no `wrangler.jsonc` and that is deliberate. Wrangler is the Workers
tool; Pages does not read it. Its presence would only invite someone to set
`npx wrangler deploy` as the deploy command, which is what broke the first
deploy.

`src/assets/` holds only fonts. Every photograph is a remote URL declared in
`src/consts.ts`, rendered through `RemoteImage.astro`, and carries alt text
that describes it as an illustration.

## Stack

Astro 7, Tailwind CSS 4 through the Vite plugin, TypeScript in `astro check`
mode, and vanilla JS in the pages. No hydration framework, no adapter, and no
server runtime, so there is no client bundle to download beyond the browser's
own and no Worker code to execute.
