<script lang="ts">
	import { isChrome } from '../stores/is-chrome';
	import Warning from './icons/warning.svelte';
</script>

<footer
	class="w-full max-w-screen-lg p-4 sm:px-8 bg-amber-950/80 border border-white/10 flex gap-4 fixed left-0 bottom-0 backdrop-blur pointer-fine:hidden md:px-16 md:left-1/2 md:-translate-x-1/2 lg:bottom-8 lg:rounded-md {!$isChrome
		? '!block'
		: ''}"
	role="alert"
>
	<div class="hidden sm:block">
		<span class="w-4 aspect-square text-amber-100 align-text-bottom inline-block">
			<Warning />
		</span>
	</div>
	<div>
		<h2 class="mb-2 text-amber-100 font-medium">Use Chrome desktop to enjoy Videmo!</h2>
		<p class="text-amber-100/80 text-pretty text-sm">
			In the near future we hope to support any device with any web browser. However, some Videmo's
			features has been developed with Web APIs that are currently only available on Chrome desktop.
		</p>
	</div>
</footer>
