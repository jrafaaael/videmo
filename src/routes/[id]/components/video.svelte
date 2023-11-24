<script lang="ts">
	import { onMount } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { interpolateZoomLevel } from '../utils/interpolate-zoom-level';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	export let videoRef: HTMLVideoElement;
	const COORD = {
		x: 0,
		y: 540
	};
	let canvasRef: HTMLCanvasElement;
	let animationId: number;
	let padding = 0;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function updateCanvas() {
		const VIDEO_NATURAL_WIDTH = videoRef.videoWidth;
		const VIDEO_NATURAL_HEIGHT = videoRef.videoHeight;
		const VIDEO_NATURAL_ASPECT_RATIO = VIDEO_NATURAL_WIDTH / VIDEO_NATURAL_HEIGHT;
		const ctx = canvasRef.getContext('2d')!;
		const p = padding * 4;
		const width = Math.min(ctx.canvas.height * VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.width) - p;
		const height = Math.min(width / VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.height);
		const left = (ctx.canvas.width - width) / 2;
		const top = (ctx.canvas.height - height) / 2;
		const zoom = sineIn(
			interpolateZoomLevel({
				time: currentTime,
				zoomInStartTime: 2,
				zoomOutStartTime: 4
			})
		);

		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
		ctx?.drawImage(
			videoRef,
			left - COORD.x * (zoom - 1),
			top - COORD.y * (zoom - 1),
			width * zoom,
			height * zoom
		);

		if (!paused) {
			animationId = window?.requestAnimationFrame(updateCanvas);
		}
	}

	onMount(() => {
		if (videoRef && canvasRef) {
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
		class="hidden"
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
		on:seeking={updateCanvas}
	/>
	<canvas width="1920" height="1080" class="rounded-md" bind:this={canvasRef} />
</div>
