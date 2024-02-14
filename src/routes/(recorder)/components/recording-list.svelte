<script lang="ts">
	import { onMount } from 'svelte';
	import Trash from '$lib/components/icons/trash.svelte';

	let recordings: string[] = [];

	async function getRecordings() {
		const root = await navigator.storage.getDirectory();
		const folders = [];

		for await (let [name] of root) {
			folders.push(name);
		}

		return folders;
	}

	async function removeRecording(name: string) {
		const root = await navigator.storage.getDirectory();

		await root.removeEntry(name, { recursive: true });
	}

	onMount(async () => {
		recordings = await getRecordings();
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
			<button
				on:click|stopPropagation={async () => {
					await removeRecording(record);
					recordings = await getRecordings();
				}}
			>
				<span class="w-4 aspect-square inline-block">
					<Trash />
				</span>
			</button>
		</div>
	</article>
{/each}
