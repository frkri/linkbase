<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let { ...props }: SVGAttributes<SVGSVGElement> = $props();
</script>

<svg fill="none" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" {...props}>
	<style>
		#smile {
			stroke: #272727;
		}
		@media (prefers-color-scheme: dark) {
			#smile {
				stroke: #e9e9e9;
			}
		}
	</style>
	<path
		d="M9 33.7748V21.3874c0-3.2854 1.3051-6.4361 3.6282-8.7592S18.102 9 21.3874 9h12.3874M94.2252 9h12.3878c3.285 0 6.436 1.3051 8.759 3.6282 2.323 2.3231 3.628 5.4738 3.628 8.7592v12.3874M119 94.2251v12.3869c0 3.286-1.305 6.437-3.628 8.76-2.323 2.323-5.474 3.628-8.759 3.628H94.2252M33.7748 119H21.3874c-3.2854 0-6.4361-1.305-8.7592-3.628C10.3051 113.049 9 109.898 9 106.612V94.2251"
		stroke="#F85D5D"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="15"
	/>
	<path
		id="smile"
		d="M39 40h.0203"
		stroke="#E9E9E9"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="22"
	/>
	<path
		id="smile"
		d="M89.0204 40h.0203"
		stroke="#E9E9E9"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="22"
	/>
	<path
		id="smile"
		d="M39 77s10 15 25 15c16.25 0 25-15 25-15"
		stroke="#E9E9E9"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="18"
	/>
</svg>
