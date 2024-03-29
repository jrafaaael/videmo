<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveFile } from './utils/save-file';
	import Dropzone from './components/dropzone.svelte';
	import RecordingList from './components/recording-list.svelte';
	import FloatingRecordingBar from './components/floating-recording-bar.svelte';
	import UseChromeDesktopAlert from './components/use-chrome-desktop-alert.svelte';

	let isDroppingNewRecording = false;

	async function handleDrop({ detail: { files } }: CustomEvent<{ files: FileList | undefined }>) {
		const file = files?.[0];

		if (!file) return;
		if (!file.type.includes('video')) return;

		const folderName = new Date().getTime().toString();
		const filename = file.name;
		const filenameWithoutExtension = filename.split('.').slice(0, -1).join('.');
		const info = {
			name: filenameWithoutExtension
		};

		localStorage.setItem(folderName, JSON.stringify(info));

		await saveFile(file, `${folderName}/${filename}`);
		await goto(folderName);
	}
</script>

<main>
	<Dropzone
		class="w-full min-h-dvh p-8 pb-44 flex flex-col gap-8 cursor-auto outline-none sm:grid sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] sm:auto-rows-min md:p-16 md:pb-44 lg:px-32 lg:gap-y-16 {isDroppingNewRecording
			? '*:pointer-events-none'
			: ''}"
		openPickerOnClick={false}
		on:dragenter={() => (isDroppingNewRecording = true)}
		on:dragover={() => (isDroppingNewRecording = true)}
		on:dragleave={() => (isDroppingNewRecording = false)}
		on:drop={(e) => {
			isDroppingNewRecording = false;
			handleDrop(e);
		}}
	>
		{#if isDroppingNewRecording}
			<article
				class="w-full h-full bg-white/10 flex justify-center items-center flex-col gap-2 fixed inset-0 z-10 backdrop-blur"
			>
				<h2 class="text-2xl font-bold">Drop it!</h2>
				<p>Drop here any video to upload it and star editing!</p>
			</article>
		{/if}
		<RecordingList />
		<FloatingRecordingBar />
		<UseChromeDesktopAlert />
	</Dropzone>
</main>
