<script lang="ts">
	import { goto } from '$app/navigation';
	import { isRecording } from '../stores/is-recording';
	import { recordScreen } from '../utils/record-screen';
	import VideoSlash from './icons/video-slash.svelte';
	import Video from './icons/video.svelte';

	const { start, stop } = recordScreen({
		onStart() {
			$isRecording = true;
		},
		async onEnd(data) {
			$isRecording = false;
			await goto(data.folder);
		}
	});

	async function handleClick() {
		if ($isRecording) {
			stop();
		} else {
			await start();
		}
	}
</script>

<footer
	class="w-auto h-11 bg-neutral-900 border-2 border-white/10 rounded-full flex items-center gap-2 fixed bottom-20 left-1/2 -translate-x-1/2"
>
	<button class="h-full px-4 flex items-center gap-2" on:click={handleClick}>
		<span class="w-4 aspect-square">
			{#if $isRecording}
				<VideoSlash />
			{:else}
				<Video />
			{/if}
		</span>
		<span>{$isRecording ? 'Stop' : 'Start'} recording</span>
	</button>
</footer>
