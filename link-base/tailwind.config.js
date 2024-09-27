/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('tailwindcss/plugin');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Geist', 'sans-serif']
		},
		extend: {}
	},
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus']);
		})
	]
};
