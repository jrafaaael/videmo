<script lang="ts">
	import { onMount } from 'svelte';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { videoStatus } from '../stores/video-status.store';
	import { background } from '../stores/background.store';
	import { appearence } from '../stores/general-appearance.store';
	import { zooms, currentZoomIndex, currentZoom } from '../stores/zooms.store';
	import { createMP4 } from '../utils/create-mp4';
	import { lerp } from '../utils/lerp';
	import {
		MICROSECONDS_PER_SECOND,
		MAX_ZOOM_LEVEL,
		MIN_ZOOM_LEVEL,
		ZOOM_TRANSITION_DURATION
	} from '../utils/constants';

	export let paused: boolean;
	export let ended: boolean;
	let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let backgroundImageRef = new Image();
	let currentTime = 0;
	let animationId: number;
	$: $videoStatus.currentTime = Math.max($edits.startAt, Math.min(currentTime, $edits.endAt));

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
		const shadow = $appearence.shadow;
		const width = Math.min(ctx.canvas.height * VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.width) - p;
		const height = Math.min(width / VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.height);
		const left = (ctx.canvas.width - width) / 2;
		const top = (ctx.canvas.height - height) / 2;

		if ($currentZoomIndex < $zooms.length - 1 && $currentZoom && frameTime >= $currentZoom.end) {
			$currentZoomIndex++;
		}

		const zoomInStart = $currentZoom?.start ?? Infinity;
		const zoomInEnd = zoomInStart + ZOOM_TRANSITION_DURATION;
		const zoomOutEnd = $currentZoom?.end ?? Infinity;
		const zoomOutStart = zoomOutEnd - ZOOM_TRANSITION_DURATION;
		const prevZoom = $zooms[$currentZoomIndex - 1];
		const nextZoom = $zooms.at($currentZoomIndex + 1);
		const isInsideZoom =
			currentZoom !== null && frameTime >= zoomInStart && frameTime <= zoomOutEnd;
		const isOverlappingNextZoom = nextZoom ? nextZoom?.start <= zoomOutEnd : false;
		const isOverlappingPrevZoom = prevZoom ? zoomInStart <= prevZoom?.end : false;
		const x = ($currentZoom?.x * width) / 100;
		const y = ($currentZoom?.y * height) / 100;
		let zoom = 1;
		let leftWithZoom = left;
		let topWithZoom = top;

		/*
		 * VIDEMO'S ZOOM WORKING PRINCIPLE
		 *
		 * zoom-in: `currentZoom.start` to `currentZoom.start + zoom transition duration`
		 * zoom-out: `currentZoom.end - transition duration` to `currentZoom.end`
		 *
		 * EXAMPLE: [{start: 1, end: 2}, {start: 3, end: 4}]
		 * WORKFLOW:
		 * 1. zoom-in transition start at 1
		 * 2. zoom-in transition end at 1.25
		 * 3. zoom level remains up to 1.75
		 * 4. zoom-out transition start at 1.75
		 * 5. zoom-out transition end at 2
		 * 6. gap between zooms (2 to 3)
		 * 7. repeat with new zoom
		 *
		 * ZOOM OVERLAP: two zooms overlap when `end` time of one is equal to `start` time of the other
		 * in this case, i don't want to zoom-in and zoom-out for every zoom. instead, i want to zoom-in on the first zoom `start` time, move zoom coordinates
		 * on every next zoom `start` time and zoom-out on the last zoom `end` time
		 *
		 * EXAMPLE: [{start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 4}]
		 * WORKFLOW:
		 * 1. zoom-in transition start at 1 and end at 1.25 to (x, y) coordinates
		 * 2. change zoom coordinates start at 2 and end at 2.25 to (x, y) coordinates
		 * 3. change zoom coordinates start at 3 and end at 3.25 to (x, y) coordinates
		 * 4. zoom-out transition start at 3.75 and end at 4
		 */
		// TODO: zoom speed
		// TODO: zoom level
		if (!isInsideZoom) {
		} else if (isOverlappingPrevZoom && frameTime >= zoomInStart && frameTime <= zoomInEnd) {
			const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);
			const prevX = (prevZoom?.x * width) / 100;
			const prevY = (prevZoom?.y * height) / 100;
			const left = lerp(prevX, x, progress);
			const top = lerp(prevY, y, progress);

			zoom = MAX_ZOOM_LEVEL;
			leftWithZoom -= left * (zoom - 1);
			topWithZoom -= top * (zoom - 1);
		} else {
			if (
				(isOverlappingPrevZoom && !isOverlappingNextZoom && frameTime >= zoomOutStart) ||
				(!isOverlappingNextZoom && frameTime >= zoomOutStart && frameTime <= zoomOutEnd)
			) {
				const progress = (frameTime - zoomOutStart) / (zoomOutEnd - zoomOutStart);

				zoom = Math.max(MIN_ZOOM_LEVEL, lerp(MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, progress));
			} else if (isOverlappingNextZoom || (frameTime >= zoomInStart && frameTime <= zoomOutStart)) {
				const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);

				zoom = Math.min(MAX_ZOOM_LEVEL, lerp(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, progress));
			} else {
				zoom = MAX_ZOOM_LEVEL;
			}

			leftWithZoom -= x * (zoom - 1);
			topWithZoom -= y * (zoom - 1);
		}

		const widthWithZoom = width * zoom;
		const heightWithZoom = height * zoom;

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
		ctx.shadowColor = `rgba(0,0,0,${shadow.opacity / 100})`;
		ctx.shadowBlur = shadow.blur;
		ctx.shadowOffsetX = shadow.x;
		ctx.shadowOffsetY = shadow.y;
		// https://stackoverflow.com/questions/77249393/how-to-apply-shadow-to-an-image-with-rounded-corners-on-html5-canvas
		ctx.fill();
		ctx.clip();
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';
		ctx?.drawImage(frame, leftWithZoom, topWithZoom, widthWithZoom, heightWithZoom);
		ctx.restore();
	}

	function animate() {
		draw(videoRef, $videoStatus.currentTime);

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
		$currentZoomIndex = 0;

		return new Promise((resolve) => {
			const { start } = createMP4({
				videoUrl: $recording?.url ?? '',
				startAt: $edits.startAt,
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
		const unsubscribeAppearenceStore = appearence.subscribe(() =>
			draw(videoRef, $videoStatus.currentTime)
		);
		const unsubscribeZoomStore = zooms.subscribe(() => {
			$currentZoomIndex = $zooms.findIndex(
				(zoom) => zoom.start >= $videoStatus.currentTime || zoom.end >= $videoStatus.currentTime
			);

			if (paused) {
				draw(videoRef, $videoStatus.currentTime);
			}
		});
		const unsubscribeVideoStatusStore = videoStatus.subscribe(() => {
			currentTime = $videoStatus.currentTime;
		});
		const controller = new AbortController();
		const signal = controller.signal;

		backgroundImageRef.addEventListener('load', () => draw(videoRef, $videoStatus.currentTime), {
			signal
		});

		return () => {
			unsubscribeVideoStatusStore();
			unsubscribeBackgroundStore();
			unsubscribeAppearenceStore();
			unsubscribeZoomStore();
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
			draw(videoRef, $videoStatus.currentTime);
		}}
		on:play={() => {
			animationId = window?.requestAnimationFrame(animate);

			if (ended || $videoStatus.currentTime >= $edits.endAt) {
				$videoStatus.currentTime = $edits.startAt;
			}
		}}
		on:pause={() => {
			if (animationId) {
				window.cancelAnimationFrame(animationId);
			}
		}}
		on:timeupdate={() => {
			if ($videoStatus.currentTime >= $edits.endAt) {
				videoRef.pause();
			}
		}}
		on:seeked={() => {
			$currentZoomIndex = $zooms.findIndex(
				(zoom) => zoom.start >= $videoStatus.currentTime || zoom.end >= $videoStatus.currentTime
			);

			if (!ended) {
				draw(videoRef, $videoStatus.currentTime);
			}
		}}
	/>
	<canvas width="1920" height="1080" class="rounded-md" bind:this={canvasRef} />
</div>
