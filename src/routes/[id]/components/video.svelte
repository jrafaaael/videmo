<script lang="ts">
	import { onMount } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { MICROSECONDS_PER_SECOND } from '$lib/utils/constants';
	import { background } from '../stores/background.store';
	import { appearence } from '../stores/general-appearance.store';
	import { interpolateZoomLevel } from '../utils/interpolate-zoom-level';
	import { createMP4 } from '../utils/create-mp4';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	const COORD = {
		x: 0,
		y: 540
	};
	let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let backgroundImageRef = new Image();
	let animationId: number;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));

	function roundCorners({
		ctx,
		width,
		height,
		top,
		left,
		radius
	}: {
		ctx: CanvasRenderingContext2D;
		width: number;
		height: number;
		top: number;
		left: number;
		radius: number;
	}) {
		ctx.beginPath();
		ctx.moveTo(left + radius, top);
		ctx.lineTo(left + width - radius, top);
		ctx.quadraticCurveTo(left + width, top, left + width, top + radius);
		ctx.lineTo(left + width, top + height - radius);
		ctx.quadraticCurveTo(left + width, top + height, left + width - radius, top + height);
		ctx.lineTo(left + radius, top + height);
		ctx.quadraticCurveTo(left, top + height, left, top + height - radius);
		ctx.lineTo(left, top + radius);
		ctx.quadraticCurveTo(left, top, left + radius, top);
		ctx.closePath();
	}

	function draw(frame: CanvasImageSource, frameTime: number) {
		const VIDEO_NATURAL_WIDTH = videoRef?.videoWidth;
		const VIDEO_NATURAL_HEIGHT = videoRef?.videoHeight;
		const VIDEO_NATURAL_ASPECT_RATIO = VIDEO_NATURAL_WIDTH / VIDEO_NATURAL_HEIGHT;
		const p = $appearence.padding * 4;
		const cornerRadius = $appearence.cornerRadius;
		const width = Math.min(ctx.canvas.height * VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.width) - p;
		const height = Math.min(width / VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.height);
		const left = (ctx.canvas.width - width) / 2;
		const top = (ctx.canvas.height - height) / 2;
		const zoom = sineIn(
			interpolateZoomLevel({
				time: frameTime,
				zoomInStartTime: 2,
				zoomOutStartTime: 4
			})
		);
		const widthWithZoom = width * zoom;
		const heightWithZoom = height * zoom;
		const leftWithZoom = left - COORD.x * (zoom - 1);
		const topWithZoom = top - COORD.y * (zoom - 1);

		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);

		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx?.drawImage(backgroundImageRef, 0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.save();
		roundCorners({
			ctx,
			width: widthWithZoom,
			height: heightWithZoom,
			top: topWithZoom,
			left: leftWithZoom,
			radius: cornerRadius
		});
		ctx.clip();
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx?.drawImage(frame, leftWithZoom, topWithZoom, widthWithZoom, heightWithZoom);
		ctx.restore();
	}

	function animate() {
		draw(videoRef, currentTime);

		if (!paused) {
			animationId = window?.requestAnimationFrame(animate);
		}
	}

	export function play() {
		videoRef?.play();
	}

	export function pause() {
		videoRef.pause();
	}

	export function exportFrameAsImage() {
		return canvasRef.toDataURL('image/png');
	}

	export function exportMP4(): Promise<string> {
		return new Promise((resolve) => {
			const { start } = createMP4({
				videoUrl: $recording?.url ?? '',
				endAt: $edits.endAt,
				renderer: (frame, time) => {
					draw(frame, time);

					return new VideoFrame(canvasRef, {
						timestamp: time * MICROSECONDS_PER_SECOND
					});
				},
				onResult({ result }) {
					resolve(result);
				}
			});

			start();
		});
	}

	onMount(() => {
		if (videoRef && canvasRef) {
			canvasRef.style.maxWidth = '100%';
			canvasRef.style.height = 'fit-content';
			canvasRef.style.maxHeight = '100%';
			canvasRef.style.objectFit = 'contain';
		}

		ctx = canvasRef.getContext('2d', { alpha: false })!;

		const unsubscribeBackgroundStore = background.subscribe(
			() => (backgroundImageRef.src = $background.url)
		);
		const unsubscribeAppearenceStore = appearence.subscribe(() => draw(videoRef, currentTime));
		const controller = new AbortController();
		const signal = controller.signal;

		backgroundImageRef.addEventListener('load', () => draw(videoRef, currentTime), { signal });

		return () => {
			unsubscribeBackgroundStore();
			unsubscribeAppearenceStore();
			controller.abort();
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
			draw(videoRef, currentTime);
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
		on:seeking={() => draw(videoRef, currentTime)}
	/>
	<canvas width="1920" height="1080" class="rounded-md" bind:this={canvasRef} />
</div>
