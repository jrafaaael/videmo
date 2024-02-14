<script lang="ts">
	import { onMount } from 'svelte';
	import Trash from '$lib/components/icons/trash.svelte';

	let recordings: string[] = [];

	onMount(async () => {
		const root = await navigator.storage.getDirectory();
		const folders = [];

		for await (let [name] of root) {
			folders.push(name);
		}

		recordings = folders;
	});
</script>

{#each recordings as record}
	<article class="flex flex-col gap-2">
		<a href="/{record}">
			<span class="w-full aspect-video bg-white/5 border border-white/5 rounded-md inline-block" />
		</a>
		<div class="flex justify-between items-center">
			<h3 class="text-sm font-medium">
				{new Date(+record).toLocaleString(undefined)}
			</h3>
			<button on:click|stopPropagation={() => console.log('here')}>
				<span class="w-4 aspect-square inline-block">
					<Trash />
				</span>
			</button>
		</div>
	</article>
{/each}
