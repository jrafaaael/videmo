<script lang="ts">
	import { goto } from '$app/navigation';
	import { createScreenRecorder } from '../utils/create-screen-recorder';
	import VideoSlash from './icons/video-slash.svelte';
	import Video from './icons/video.svelte';

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

<footer
	class="w-auto h-11 bg-neutral-900 border-2 border-white/10 rounded-full flex items-center gap-2 fixed bottom-20 left-1/2 -translate-x-1/2"
>
	<button class="h-full px-4 flex items-center gap-2" on:click={handleClick}>
		<span class="w-4 aspect-square">
			{#if $recorder.isRecording}
				<VideoSlash />
			{:else}
				<Video />
			{/if}
		</span>
		<span>{$recorder.isRecording ? 'Stop' : 'Start'} recording</span>
	</button>
</footer>
