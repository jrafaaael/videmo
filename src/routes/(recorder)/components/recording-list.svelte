<script lang="ts">
	import { onMount } from 'svelte';
	import { rename } from '$lib/utils/opfs';
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
		const root = await navigator.storage.getDirectory();
		const folders: string[] = await getRecordings();

		recordings = await Promise.all(
			folders.map(async (name) => {
				/**
				 * Previously, recordings that were drag-n-drop'd in Videmo were saved with their original filename. However, when users record directly from Chrome,
				 * their filename is the recording date in UTC. This is a problem because OPFS sort files alphabetically, so:
				 * 1. some recordings that were drag-n-drop'd are listed at top of recording list, even if the last user video was recorded directly from Chrome.
				 * 2. some recordings that were drag-n-drop'd are listed at bottom of recording list, even if this was the latest video in Videmo.
				 * With this conditional, I rename folders with original filename from drag-n-drop'd recordings and save it with the current date in UTC as filename
				 * to keep compatibility with the old behavior. However, this create a new problem: users will search their recordings with original name because
				 * those recordings were saved with this behavior. To solve this, in their associated object value in localStorage,
				 * I create a new key called `name` to save the original name. This allows me to develop some new features:
				 * 1. rename recordings
				 * 2. sort recordings alphabetically and by date
				 */
				if (isNaN(Number(name))) {
					const folder = await root.getDirectoryHandle(name);
					const newFolderName = new Date().getTime().toString();
					const info = JSON.parse(localStorage.getItem(name) ?? '{}');
					const updated = { ...info, name };

					await rename(folder, newFolderName);

					localStorage.removeItem(name);
					localStorage.setItem(newFolderName, JSON.stringify(updated));

					return newFolderName;
				}

				return name;
			})
		);
	});
</script>

{#each recordings as record}
	{@const recordingInfo = JSON.parse(localStorage.getItem(record) ?? '{}')}
	{@const folderName = recordingInfo.name ?? new Date(+record).toLocaleString()}
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
