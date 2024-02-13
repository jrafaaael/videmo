<script lang="ts">
	import { goto } from '$app/navigation';
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

<main class="w-full h-full flex justify-center items-center">
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
</main>
