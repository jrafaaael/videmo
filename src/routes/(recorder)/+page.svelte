<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveFile } from './utils/save-file';
	import Dropzone from './components/dropzone.svelte';
	import RecordingList from './components/recording-list.svelte';
	import FloatingRecordingBar from './components/floating-recording-bar.svelte';

	async function handleDrop({ detail: { files } }: CustomEvent<{ files: FileList | undefined }>) {
		const file = files?.[0];

		if (!file) return;
		if (!file.type.includes('video')) return;

		const filename = file.name;
		const folderName = file.name.split('.').slice(0, -1).join('.');

		await saveFile(file, `${folderName}/${filename}`);
		await goto(folderName);
	}
</script>

<main>
	<Dropzone
		class="w-full min-h-dvh p-8 pb-44 grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] auto-rows-min gap-8 cursor-default md:p-16 md:pb-44 lg:px-32 lg:gap-y-16"
		openPickerOnClick={false}
		on:drop={handleDrop}
	>
		<RecordingList />
		<FloatingRecordingBar />
	</Dropzone>
</main>
