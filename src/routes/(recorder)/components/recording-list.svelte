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
	{@const folderName = isNaN(Number(record)) ? record : new Date(+record).toLocaleString()}
	<article class="flex flex-col gap-2">
		<a href="/{record}">
			<span class="w-full aspect-video bg-white/5 border border-white/5 rounded-md inline-block" />
		</a>
		<div class="flex justify-between items-center">
			<h3 class="text-sm font-medium">
				<a class="py-2" href="/{record}">
					{folderName}
				</a>
			</h3>
			<button
				class="p-2 text-neutral-300 flex transition-colors hover:text-red-500"
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
{:else}
	<article class="flex flex-col gap-2">
		<span
			class="w-full aspect-video bg-white/5 border-2 border-white/10 rounded-md text-4xl flex justify-center items-center relative"
			id="empty"
		>
			🕳️
		</span>
		<div class="flex flex-col gap-1">
			<h3 class="font-medium">No recordings yet!</h3>
			<p class="text-sm">Record, upload or drag 'n drop your first video and it'll show up here!</p>
		</div>
	</article>
{/each}

<style>
	#empty::before {
		--line: hsla(0, 0%, 95%, 0.05);
		content: '';
		height: 100%;
		width: 100%;
		position: absolute;
		background: linear-gradient(90deg, var(--line) 2px, transparent 2px 4vmin) 0 -2vmin / 4vmin 4vmin,
			linear-gradient(var(--line) 2px, transparent 2px 4vmin) 0 -2vmin / 4vmin 4vmin;
		inset: 0;
		transform: translate3d(0, 0, -100vmin);
	}
</style>
