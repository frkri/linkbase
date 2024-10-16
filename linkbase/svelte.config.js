import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(new URL('package.json', import.meta.url));
const pkg = JSON.parse(readFileSync(path, 'utf8'));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			assets: 'build',
			fallback: undefined,
			pages: 'build',
			precompress: false,
			strict: true
		}),
		csp: {
			directives: {
				'script-src': ['self']
			}
		},
		version: { name: `${pkg.version}_${process.env.CF_PAGES_COMMIT_SHA || 'dev'}` }
	},
	preprocess: vitePreprocess()
};

export default config;
