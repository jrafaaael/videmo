<script lang="ts">
	import { sineIn, sineOut } from 'svelte/easing';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { onMount } from 'svelte';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	export let videoRef: HTMLVideoElement;
	const START_TIME = 4;
	const END_TIME = 6;
	const MAX_ZOOM_LEVEL = 2;
	const ZOOM_DURATION = 1;
	let canvasRef: HTMLCanvasElement;
	let animationId: number;
	let padding = 0;
	let zoom = 1;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function updateCanvas() {
		const MINIMUM_PADDING = 100;
		const ctx = canvasRef.getContext('2d')!;
		const aspectRatio = canvasRef?.width / canvasRef?.height;
		const p = padding * 4;
		const width = canvasRef?.width - p - MINIMUM_PADDING;
		const height = (canvasRef?.width - p) / aspectRatio;
		const left = (canvasRef?.width - width) / 2;
		const top = (canvasRef?.height - height) / 2;

		if (currentTime >= START_TIME - ZOOM_DURATION && currentTime <= END_TIME) {
			const t = currentTime - (START_TIME - 1);
			zoom += ((25 * MAX_ZOOM_LEVEL) / 1000) * sineIn(t);
			if (zoom >= 2) zoom = 2;
		} else if (currentTime >= END_TIME && currentTime <= END_TIME + ZOOM_DURATION) {
			const t = currentTime - END_TIME;
			zoom -= ((25 * MAX_ZOOM_LEVEL) / 1000) * sineOut(t);
			if (zoom <= 1) zoom = 1;
		}

		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
		ctx?.drawImage(videoRef, left, top, width * zoom, height * zoom);

		if (!paused) {
			animationId = window?.requestAnimationFrame(updateCanvas);
		}
	}

	onMount(() => {
		if (videoRef && canvasRef) {
			canvasRef.width = 1920;
			canvasRef.height = 1080;
			canvasRef.style.maxWidth = '100%';
			canvasRef.style.height = 'fit-content';
			canvasRef.style.maxHeight = '100%';
			canvasRef.style.objectFit = 'contain';
		}
	});
</script>

<div class="w-auto h-full flex justify-center items-center relative">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		autoplay
		playsinline
		class="max-w-full maw-h-full hidden"
		src={$recording?.url}
		bind:currentTime
		bind:paused
		bind:ended
		bind:this={videoRef}
		on:loadeddata={() => {
			videoRef.pause();
			updateCanvas();
		}}
		on:play={() => {
			animationId = window?.requestAnimationFrame(updateCanvas);

			if (ended || currentTime >= $edits.endAt) {
				currentTime = $edits.startAt;
			}
		}}
		on:pause={() => {
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
