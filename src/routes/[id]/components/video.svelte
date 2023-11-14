<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	export let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function handleSetCanvasSize() {
		if (videoRef && canvasRef) {
			const videoRect = videoRef?.getBoundingClientRect();
			canvasRef.width = videoRect.width;
			canvasRef.height = videoRect.height;
			videoRef.style.display = 'none';
		}
	}

	function updateCanvas() {
		const ctx = canvasRef?.getContext('2d');

		ctx?.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);

		window?.requestAnimationFrame(updateCanvas);
	}
</script>

<div class="w-full h-full flex justify-center items-center">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		class="w-full max-h-full aspect-video"
		src={$recording?.url}
		bind:currentTime
		bind:paused
		bind:ended
		bind:this={videoRef}
		on:loadedmetadata={handleSetCanvasSize}
		on:play={() => {
			updateCanvas();

			if (ended || currentTime >= $edits.endAt) {
				currentTime = $edits.startAt;
			}
		}}
		on:timeupdate={() => {
			if (currentTime >= $edits.endAt) {
				videoRef.pause();
			}
		}}
	/>
	<canvas bind:this={canvasRef} />
</div>
