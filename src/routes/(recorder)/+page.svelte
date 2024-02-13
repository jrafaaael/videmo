<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Video from './components/icons/video.svelte';
	import VideoSlash from './components/icons/video-slash.svelte';
	import { createScreenRecorder } from './utils/create-screen-recorder';

	const recorder = createScreenRecorder({
		onEnd(data) {
			goto(data.folder);
		}
	});
	let recordings: string[] = [];

	function handleClick() {
		if ($recorder.isRecording) {
			recorder.stop();
		} else {
			recorder.start();
		}
	}

	onMount(async () => {
		const root = await navigator.storage.getDirectory();
		const folders = [];

		for await (let [name] of root) {
			folders.push(name);
		}

		recordings = folders;
	});
</script>

<main class="w-full h-full flex justify-center items-center gap-2">
	<button
		class="py-[6px] px-3 bg-purple-600 rounded-md flex items-center gap-2"
		on:click={handleClick}
	>
		<div class="w-4 aspect-square">
			{#if $recorder.isRecording}
				<VideoSlash />
			{:else}
				<Video />
			{/if}
		</div>
		<span>{$recorder.isRecording ? 'Stop' : 'Start'} recording</span>
	</button>
	{#each recordings as record}
		<a href="/{record}">{record}</a>
	{/each}
</main>
