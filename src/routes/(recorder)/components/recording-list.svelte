<script lang="ts">
	import { onMount } from 'svelte';
	import Recording from './recording.svelte';

	let recordings = getRecordings();

	async function getRecordings(): Promise<string[]> {
		const root = await navigator.storage.getDirectory();
		const folders = [];

		for await (let [name] of root) {
			if (!isNaN(Number(name))) folders.push(name);
		}

		return folders;
	}

	onMount(async () => {
		const root = await navigator.storage.getDirectory();

		for await (let [name] of root) {
			const folder = await root.getDirectoryHandle(name);

			for await (let [filename] of folder) {
				if (filename.includes('.mp4')) return;

				root.removeEntry(name, { recursive: true });
			}
		}
	});
</script>

{#await recordings then videos}
	{#each videos as record}
		{@const recordingInfo = JSON.parse(localStorage.getItem(record) ?? '{}')}
		{@const folderName = recordingInfo.name ?? new Date(+record).toLocaleString()}
		<Recording
			name={folderName}
			id={record}
			on:remove={() => (recordings = getRecordings())}
			on:rename={() => (recordings = getRecordings())}
		/>
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
				<p class="text-sm">
					Record, upload or drag 'n drop your first video and it'll show up here!
				</p>
			</div>
		</article>
	{/each}
{/await}

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
