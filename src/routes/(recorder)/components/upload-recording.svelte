<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveFile } from '../utils/save-file';
	import Upload from './icons/upload.svelte';

	let inputRef: HTMLInputElement;

	async function handleUpload(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const files = e.currentTarget.files;
		const file = files?.[0];

		if (!file) return;
		if (!file.type.includes('video')) return;

		const filename = file.name;
		const folderName = file.name.split('.').slice(0, -1).join('.');

		await saveFile(file, `${folderName}/${filename}`);
		await goto(folderName);
	}
</script>

<button
	class="h-full px-5 flex items-center gap-2"
	on:click={() => {
		inputRef.showPicker();
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
	tabindex="-1"
	bind:this={inputRef}
	on:change={handleUpload}
/>
