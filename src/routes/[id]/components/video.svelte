<script lang="ts">
	import { onMount } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { background } from '../stores/background.store';
	import { appearence } from '../stores/general-appearance.store';
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
	let backgroundImageRef: HTMLImageElement = new Image();
	let animationId: number;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function updateBackground() {
		backgroundImageRef.src = $background.url;

		backgroundImageRef.addEventListener('load', () => draw());
	}

	function draw() {
		const VIDEO_NATURAL_WIDTH = videoRef?.videoWidth;
		const VIDEO_NATURAL_HEIGHT = videoRef?.videoHeight;
		const VIDEO_NATURAL_ASPECT_RATIO = VIDEO_NATURAL_WIDTH / VIDEO_NATURAL_HEIGHT;
		const ctx = canvasRef.getContext('2d')!;
		const p = $appearence.padding * 4;
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
		ctx?.drawImage(backgroundImageRef, 0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx?.drawImage(
			videoRef,
			left - COORD.x * (zoom - 1),
			top - COORD.y * (zoom - 1),
			width * zoom,
			height * zoom
		);
	}

	function animate() {
		draw();

		if (!paused) {
			animationId = window?.requestAnimationFrame(animate);
		}
	}

	onMount(() => {
		if (videoRef && canvasRef) {
			canvasRef.style.maxWidth = '100%';
			canvasRef.style.height = 'fit-content';
			canvasRef.style.maxHeight = '100%';
			canvasRef.style.objectFit = 'contain';
		}

		const unsubscribeBackgroundStore = background.subscribe(updateBackground);
		const unsubscribeAppearenceStore = appearence.subscribe(draw);

		return () => {
			unsubscribeBackgroundStore();
			unsubscribeAppearenceStore();
		};
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
			draw();
		}}
		on:play={() => {
			animationId = window?.requestAnimationFrame(animate);

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
		on:seeking={draw}
	/>
	<canvas width="1920" height="1080" class="rounded-md" bind:this={canvasRef} />
</div>
