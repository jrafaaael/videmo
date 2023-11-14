<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Forward from './icons/forward.svelte';
	import Play from './icons/play.svelte';
	import Pause from './icons/pause.svelte';

	export let paused: boolean;

	let dispatch = createEventDispatcher();
</script>

<div class="flex justify-center items-center gap-2">
	<button
		class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
	>
		<div class="w-5 aspect-square -scale-100">
			<Forward />
		</div>
	</button>
	<button
		class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
		on:click={() => dispatch('changeVideoState')}
	>
		<div class="w-5 aspect-square">
			{#if paused}
				<Play />
			{:else}
				<Pause />
			{/if}
		</div>
	</button>
	<button
		class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
	>
		<div class="w-5 aspect-square">
			<Forward />
		</div>
	</button>
</div>
