<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { FFmpeg } from '@ffmpeg/ffmpeg';
	import { ffmpeg } from '$lib/stores/ffmpeg.store';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import Video from './components/icons/video.svelte';
	import VideoSlash from './components/icons/video-slash.svelte';
	import { createScreenRecorder } from './utils/create-screen-recorder';

	const recorder = createScreenRecorder({
		onEnd(video) {
			recording.set(video);
			edits.set({ startAt: 0, endAt: video.duration });
			goto(video.id);
		}
	});

	function handleClick() {
		if ($recorder.isRecording) {
			recorder.stop();
		} else {
			recorder.start();
		}
	}

	onMount(() => {
		ffmpeg.set(new FFmpeg());
	});
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
