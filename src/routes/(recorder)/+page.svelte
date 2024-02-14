<script lang="ts">
	import { goto } from '$app/navigation';
	import RecordingList from './components/recording-list.svelte';
	import Video from './components/icons/video.svelte';
	import VideoSlash from './components/icons/video-slash.svelte';
	import { createScreenRecorder } from './utils/create-screen-recorder';

	const recorder = createScreenRecorder({
		onEnd(data) {
			goto(data.folder);
		}
	});

	function handleClick() {
		if ($recorder.isRecording) {
			recorder.stop();
		} else {
			recorder.start();
		}
	}
</script>

<main
	class="w-full h-full p-8 grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] auto-rows-min gap-8 md:p-16 lg:px-32 lg:gap-y-16"
>
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
	<RecordingList />
</main>
