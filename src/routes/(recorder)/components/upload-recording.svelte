<script lang="ts">
	import Upload from './icons/upload.svelte';

	let input: HTMLInputElement;

	async function handleUpload(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const files = e.currentTarget.files;
		const file = files?.[0];

		if (!file) return;
		if (!file.type.includes('video')) return;

		const root = await navigator.storage.getDirectory();
		const now = new Date().getTime().toString();
		const folder = await root.getDirectoryHandle(now, { create: true });
		const video = await folder.getFileHandle(file.name, { create: true });
		const writable = await video.createWritable();
		await writable.write(file);
		await writable.close();
	}
</script>

<button
	class="h-full px-5 flex items-center gap-2"
	on:click={() => {
		input.showPicker();
	}}
>
	<span class="w-4 aspect-square text-neutral-50/50">
		<Upload />
	</span>
	<span>Upload video</span>
</button>
<input
	class="sr-only"
	type="file"
	name="recording"
	id="recording"
	accept="video/*"
	bind:this={input}
	on:change={handleUpload}
/>
