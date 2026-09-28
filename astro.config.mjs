// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

/*
 * The site's own origin, which is what every canonical URL, every `og:url` and
 * every entry in the sitemap is built from.
 *
 * It is read from the environment rather than written here, because it is a
 * deployment setting and not a source setting: the same build is served from
 * cea.kube in review and from a Cloudflare Pages domain in production, and a
 * hardcoded value would be wrong for one of them. Set CEA_SITE_URL in the
 * build environment. When it is absent the site still builds, but Astro emits
 * no canonical tags, no `og:url` and no sitemap — a wrong origin is worse than
 * a missing one, because a wrong one is indexed.
 */
const site = process.env.CEA_SITE_URL;

if (!site && process.env.NODE_ENV === 'production') {
	console.warn(
		'\n  CEA_SITE_URL is not set.\n' +
			'  The build will finish, but every canonical URL, og:url and sitemap entry\n' +
			'  will be omitted, because there is no correct origin to build them from.\n',
	);
}

const isAbsolute = (value) => {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
};

if (site && !isAbsolute(site)) {
	throw new Error(
		`CEA_SITE_URL must be an absolute http(s) URL, got ${JSON.stringify(site)}.`,
	);
}

// https://astro.build/config
export default defineConfig({
	// Dev-server only. None of this reaches the Cloudflare Pages build: the
	// production build has no server to bind, and the deployed output is static
	// files. It is here because the local preview reaches the dev server through
	// Traefik on a hostname Vite would otherwise refuse to answer for.
	vite: {
		plugins: [tailwindcss()],
		server: {
			// Astro runs Vite underneath, and Vite 6+ rejects any Host header that
			// is not localhost — so without this every request through Traefik is
			// answered "Blocked request. This host is not allowed."
			allowedHosts: ['cea.kube'],
			hmr: {
				// Traefik terminates TLS at the edge; the dev server itself speaks
				// plain HTTP inside the pod.
				host: 'cea.kube',
				protocol: 'wss',
				clientPort: 443,
			},
			watch: {
				// inotify does not reliably cross the hostPath/VirtioFS boundary on
				// macOS, so the watcher polls rather than silently missing edits.
				usePolling: true,
				interval: 300,
			},
		},
	},

	// Undefined when CEA_SITE_URL is unset, which is what suppresses canonical
	// tags and the sitemap rather than filling them with a placeholder host.
	site,
	integrations: [mdx(), sitemap()],
});
