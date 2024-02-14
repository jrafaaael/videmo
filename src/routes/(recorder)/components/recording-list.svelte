<script lang="ts">
	import { onMount } from 'svelte';

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
	<a class="flex flex-col gap-4" href="/{record}">
		<span class="w-full aspect-video bg-white/5 border border-white/5 rounded-md inline-block" />
		<span class="text-sm font-medium">{new Date(+record).toLocaleString(undefined)}</span>
	</a>
{/each}
