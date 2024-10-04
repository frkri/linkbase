import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			assets: 'build',
			fallback: undefined,
			pages: 'build',
			precompress: false,
			strict: true
		})
	},

	preprocess: vitePreprocess()
};

export default config;
