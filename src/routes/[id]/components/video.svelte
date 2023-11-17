<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	export let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let animationId: number;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function handleSetCanvasSize() {
		if (videoRef && canvasRef) {
			canvasRef.width = 1280;
			canvasRef.height = 720;
			canvasRef.style.width = '100%';
			canvasRef.style.height = '100%';
			canvasRef.style.objectFit = 'contain';
			videoRef.style.display = 'none';

			const ctx = canvasRef?.getContext('2d');
			ctx!.fillStyle = 'blue';
			ctx!.fillRect(0, 0, canvasRef.width, canvasRef.height);
		}
	}

	function updateCanvas() {
		const ctx = canvasRef?.getContext('2d');
		const scale = canvasRef.width / canvasRef.height;
		const padding = 50 * 2;
		const height = canvasRef.height - padding;
		const width = height * scale - padding;
		const left = (canvasRef.width - width) / 2;
		const top = (canvasRef.height - height) / 2;

		ctx?.drawImage(videoRef, left, top, width, height);

		animationId = window?.requestAnimationFrame(updateCanvas);
	}
</script>

<div class="w-auto h-full aspect-video relative">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		playsinline
		class="max-w-full maw-h-full"
		src={$recording?.url}
		bind:currentTime
		bind:paused
		bind:ended
		bind:this={videoRef}
		on:loadedmetadata={handleSetCanvasSize}
		on:play={() => {
			window?.requestAnimationFrame(updateCanvas);

			if (ended || currentTime >= $edits.endAt) {
				currentTime = $edits.startAt;
			}
		}}
		on:pause={() => {
			if (animationId) {
				window.cancelAnimationFrame(animationId);
			}
		}}
		on:ended={() => {
			if (animationId) {
				window.cancelAnimationFrame(animationId);
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