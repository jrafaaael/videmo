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
		class="p-2 rounded-md text-neutral-300 flex justify-center items-center transition-all hover:bg-white/5 hover:text-neutral-200"
	>
		<span class="w-5 aspect-square inline-block -scale-100">
			<Forward />
		</span>
	</button>
	<button
		class="p-2 rounded-md text-neutral-300 flex justify-center items-center transition-all hover:bg-white/5 hover:text-neutral-200"
		on:click={() => dispatch('changeVideoState')}
	>
		<span class="w-5 aspect-square inline-block">
			{#if paused}
				<Play />
			{:else}
				<Pause />
			{/if}
		</span>
	</button>
	<button
		class="p-2 rounded-md text-neutral-300 flex justify-center items-center transition-all hover:bg-white/5 hover:text-neutral-200"
	>
		<span class="w-5 aspect-square inline-block">
			<Forward />
		</span>
	</button>
</div>
