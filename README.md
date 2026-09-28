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

Connect the repository under **Workers & Pages → Create → Pages → Connect to
Git**, then set:

| Setting                | Value                      |
| :--------------------- | :------------------------- |
| Framework preset       | `Astro`                    |
| Build command          | `npm run build`            |
| Build output directory | `dist`                     |
| Root directory         | repository root            |

`npm run build` is `astro build && node scripts/prune-unused-assets.mjs`. It is
not a Pages build image requirement — the same command produces the same output
on a laptop, in the pod, and in Cloudflare.

Add these under **Settings → Environment variables → Production and Preview**:

| Variable        | Value                | Required |
| :-------------- | :------------------- | :------- |
| `CEA_SITE_URL`  | the production URL   | yes      |
| `NODE_VERSION`  | `22`                 | yes      |

`CEA_SITE_URL` must be the site's own origin with no trailing slash, for
example `https://cea.uic.edu.ph`. Every canonical tag, every `og:url` and the
whole sitemap are built from it. When it is missing the build still succeeds
but emits none of those, which is deliberate: a wrong origin gets indexed, a
missing one does not. A non-absolute value fails the build outright.

`NODE_VERSION` has to be set in the dashboard. The build image ships its own
default Node, that default has changed over time, and `engines` in
`package.json` is not what selects it. Astro 7 needs Node 20.19, 22.12 or 24;
`.node-version` is committed as a second signal for local and CI use.

Neither value belongs in the repository. `astro.config.mjs` reads the origin
from the environment precisely so that one build can be served from `cea.kube`
in review and from a Pages domain in production without a wrong absolute URL
reaching the page.

### After the first deploy

- Confirm `https://<your-domain>/sitemap-index.xml` opens. If it 404s, the
  production build ran without `CEA_SITE_URL`.
- Confirm `/_redirects` was copied: `https://<your-domain>/events` should land
  on the events page with a 301.
- Confirm `/_headers` was copied by checking that
  `https://<your-domain>/_astro/` assets carry
  `Cache-Control: public, max-age=31536000, immutable`.
- Page routes end in a trailing slash (`/programs/bs-architecture/`) because
  Astro's `directory` output format puts an `index.html` in each folder, and
  both the canonical tags and the sitemap follow it. If you ever change
  `build.format`, those two move together or they contradict each other.

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
scripts/            the two verifiers, plus the post-build asset prune
Dockerfile.static   static image used by the local k8s preview
Caddyfile           serves ./dist for that preview
```

`src/assets/` holds only fonts. Every photograph is a remote URL declared in
`src/consts.ts`, rendered through `RemoteImage.astro`, and carries alt text
that describes it as an illustration.

## Stack

Astro 7, Tailwind CSS 4 through the Vite plugin, TypeScript in `astro check`
mode, and vanilla JS in the pages. No hydration framework and no runtime
dependency, so there is no client bundle to download beyond the browser's own.
