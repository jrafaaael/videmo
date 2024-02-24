<script lang="ts">
	import { goto } from '$app/navigation';
	import { isRecording } from '../stores/is-recording';
	import { recordScreen } from '../utils/record-screen';
	import VideoSlash from './icons/video-slash.svelte';
	import Video from './icons/video.svelte';

	let countdown = 3000;
	let interval: number | null = null;
	const { start, stop } = recordScreen({
		countdown,
		onStart() {
			interval = setInterval(() => (countdown -= 1000), 1000);
		},
		async onEnd(data) {
			$isRecording = false;
			await goto(data.folder);
		}
	});

	async function handleClick() {
		if ($isRecording) {
			stop();
			return;
		}

		try {
			await start();
			$isRecording = true;
		} catch (error) {
			console.error(error);
		}
	}

	$: if (countdown <= 0) {
		clearInterval(interval!);
		interval = null;
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
		<span>{$isRecording ? 'Stop' : 'Start'} recording {countdown}</span>
	</button>
</footer>
