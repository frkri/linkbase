/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('tailwindcss/plugin');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus']);
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
