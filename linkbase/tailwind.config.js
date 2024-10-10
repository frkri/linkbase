/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('tailwindcss/plugin');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus']);
			addVariant('hocus-within', ['&:hover', '&:focus-within']);
		}),
		plugin(function ({ addBase }) {
			addBase({
				'[type="search"]::-webkit-search-cancel-button': { display: 'none' },
				'[type="search"]::-webkit-search-decoration': { display: 'none' },
				'[type="search"]::-webkit-search-results-button': { display: 'none' },
				'[type="search"]::-webkit-search-results-decoration': { display: 'none' }
			});
		})
	],
	theme: {
		extend: {},
		fontFamily: {
			mono: ['Jetbrains Mono', 'monospace'],
			sans: ['Geist', 'sans-serif']
		}
	}
};
