<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	export let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let animationId: number;
	let padding: number = 32;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function handleSetCanvasSize() {
		if (videoRef && canvasRef) {
			canvasRef.width = 1920;
			canvasRef.height = 1080;
			canvasRef.style.maxWidth = '100%';
			canvasRef.style.height = 'fit-content';
			canvasRef.style.maxHeight = '100%';
			canvasRef.style.objectFit = 'contain';
			videoRef.style.display = 'none';
			videoRef.play();
			redraw();
		}
	}

	function redraw() {
		const MINIMUM_PADDING = 100;
		const ctx = canvasRef?.getContext('2d');
		const scale = canvasRef?.width / canvasRef?.height;
		const p = padding * 4;
		const width = canvasRef?.width - p - MINIMUM_PADDING;
		const height = (canvasRef?.width - p) / scale;
		const left = (canvasRef?.width - width) / 2;
		const top = (canvasRef?.height - height) / 2;

		ctx!.fillStyle = 'blue';
		ctx!.fillRect(0, 0, canvasRef.width, canvasRef.height);
		ctx?.drawImage(videoRef, left, top, width, height);
	}

	function updateCanvas() {
		redraw();

		if (!paused) {
			animationId = window?.requestAnimationFrame(updateCanvas);
		}
	}

	function increasePadding() {
		const ctx = canvasRef?.getContext('2d');
		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		redraw();
	}
</script>

<div class="w-auto h-full flex justify-center items-center relative">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		autoplay
		playsinline
		class="max-w-full maw-h-full"
		src={$recording?.url}
		bind:currentTime
		bind:paused
		bind:ended
		bind:this={videoRef}
		on:loadedmetadata={handleSetCanvasSize}
		on:loadeddata={() => {
			videoRef.pause();
			updateCanvas();
		}}
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
	<input type="range" min="0" max="100" step="1" bind:value={padding} on:input={increasePadding} />
	<output>{padding}</output>
</div>
