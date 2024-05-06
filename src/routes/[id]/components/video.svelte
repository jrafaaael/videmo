<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { recording } from '../stores/recording.store';
	import { edits } from '../stores/edits.store';
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
	let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let backgroundImageRef = new Image();
	let currentTime = 0;
	let ended: boolean;
	let animationId: number;
	let currentZoomLevel = 1;

	$: if (!paused)
		$videoStatus.currentTime = Math.max($edits.startAt, Math.min(currentTime, $edits.endAt));

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
		let nextZoom = $zooms.at($currentZoomIndex + 1);

		if (
			$currentZoomIndex < $zooms.length - 1 &&
			$currentZoom &&
			(frameTime >= $currentZoom.end + ZOOM_TRANSITION_DURATION ||
				(nextZoom && frameTime >= nextZoom.start))
		) {
			$currentZoomIndex++;
		}

		const zoomInStart = $currentZoom?.start ?? Infinity;
		const zoomInEnd = zoomInStart + ZOOM_TRANSITION_DURATION;
		const zoomOutStart = $currentZoom?.end ?? Infinity;
		const zoomOutEnd = zoomOutStart + ZOOM_TRANSITION_DURATION;
		const prevZoom = $zooms[$currentZoomIndex - 1];
		nextZoom = $zooms.at($currentZoomIndex + 1);
		const isOverlappingPrevZoom = prevZoom?.end + ZOOM_TRANSITION_DURATION >= zoomInStart;
		const x = ($currentZoom?.x * width) / 100;
		const y = ($currentZoom?.y * height) / 100;
		let leftWithZoom = left;
		let topWithZoom = top;

		/*
		 * VIDEMO'S ZOOM WORKING PRINCIPLE
		 *
		 * zoom-in: `currentZoom.start` to `currentZoom.start + zoom transition duration`
		 * zoom-out: `currentZoom.end` to `currentZoom.end + zoom transition duration`
		 *
		 * EXAMPLE: [{start: 1, end: 2.5}, {start: 4, end: 5}]
		 * WORKFLOW:
		 * 1. zoom-in transition start at 1
		 * 2. zoom-in transition end at 2
		 * 3. zoom level remains up to 2.5
		 * 4. zoom-out transition start at 2.5
		 * 5. zoom-out transition end at 3.5
		 * 6. gap between zooms (3.5 to 4)
		 * 7. repeat with new zoom
		 *
		 * ZOOM CHAIN: zoom chain exists when `end` time of one zoom is equal to `start` time of the next one
		 * in this case, i don't want to zoom-in and zoom-out for every zoom. instead, i want to zoom-in on the first `start` time, move zoom coordinates
		 * on every next `start` time and zoom-out on the last `end` time
		 *
		 * EXAMPLE: [{start: 1, end: 2}, {start: 2, end: 3}, {start: 3, end: 4}]
		 * WORKFLOW:
		 * 1. zoom-in transition start at 1 and end at 2 to (x, y) coordinates
		 * 2. change zoom coordinates start at 2 and end at 3 to (x, y) coordinates
		 * 3. change zoom coordinates start at 3 and end at 4 to (x, y) coordinates
		 * 4. zoom-out transition start at 4 and end at 5
		 *
		 * ZOOM OVERLAP: zoom overlap exists when `end` time of one zoom + zoom transition duration is greater than `start` time of the next one but not equals
		 * in this case, i want to start zooming-out and reconciliate the zoom progress for the zoom-in phase of the next zoom
		 *
		 * EXAMPLE: [{start: 1, end: 2}, {start: 2.25, end: 4}]
		 * WORKFLOW:
		 * 1. zoom-in transition start at 1 and end at 2 to (x, y) coordinates
		 * 2. zoom-out transition start at 2. zoom-out phase should end at 3 but next zoom-in phase start at 2.25
		 * 3. zoom-in transition start at 2.25. zoom level begins at last zoom level from previous zoom-out phase
		 * 4. zoom-in transition end at 3.25
		 * 5. zoom-out transition start at 4 and end at 5
		 */
		// TODO: zoom speed
		// TODO: zoom level
		if (
			isOverlappingPrevZoom &&
			zoomInStart !== prevZoom.end &&
			prevZoom.end + ZOOM_TRANSITION_DURATION >= zoomInStart &&
			frameTime <= zoomOutStart
		) {
			const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);
			const eased = expoOut(Math.min(progress, 1));
			const prevX = (prevZoom?.x * width) / 100;
			const prevY = (prevZoom?.y * height) / 100;
			const left = lerp(prevX, x, eased);
			const top = lerp(prevY, y, eased);

			currentZoomLevel = Math.max(currentZoomLevel, lerp(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, eased));
			leftWithZoom -= left * (currentZoomLevel - 1);
			topWithZoom -= top * (currentZoomLevel - 1);
		} else if (isOverlappingPrevZoom && frameTime >= zoomInStart && frameTime <= zoomInEnd) {
			const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);
			const eased = expoOut(progress);
			const prevX = (prevZoom?.x * width) / 100;
			const prevY = (prevZoom?.y * height) / 100;
			const left = lerp(prevX, x, eased);
			const top = lerp(prevY, y, eased);

			currentZoomLevel = MAX_ZOOM_LEVEL;
			leftWithZoom -= left * (currentZoomLevel - 1);
			topWithZoom -= top * (currentZoomLevel - 1);
		} else if (frameTime >= zoomOutStart && frameTime <= zoomOutEnd) {
			const progress = (frameTime - zoomOutStart) / (zoomOutEnd - zoomOutStart);
			const eased = expoOut(Math.min(progress, 1));

			currentZoomLevel = lerp(MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, eased);
			leftWithZoom -= x * (currentZoomLevel - 1);
			topWithZoom -= y * (currentZoomLevel - 1);
		} else if (frameTime >= zoomInStart && frameTime <= zoomOutStart) {
			const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);
			const eased = expoOut(Math.min(progress, 1));

			currentZoomLevel = lerp(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, eased);
			leftWithZoom -= x * (currentZoomLevel - 1);
			topWithZoom -= y * (currentZoomLevel - 1);
		}

		const widthWithZoom = width * currentZoomLevel;
		const heightWithZoom = height * currentZoomLevel;

		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);

		if (typeof $background === 'string') {
			ctx.fillStyle = $background;
			ctx.fillRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		} else {
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
			ctx?.drawImage(backgroundImageRef, 0, 0, ctx.canvas.width, ctx.canvas.height);
		}

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
		ctx = canvasRef.getContext('2d', { alpha: false })!;

		const controller = new AbortController();
		const signal = controller.signal;
		const unsubscribeBackgroundStore = background.subscribe(() => {
			if (typeof $background === 'string') {
				draw(videoRef, $videoStatus.currentTime);
				return;
			}

			backgroundImageRef.src = $background.url;
		});
		const unsubscribeAppearenceStore = appearence.subscribe(() =>
			draw(videoRef, $videoStatus.currentTime)
		);
		const unsubscribeZoomStore = zooms.subscribe(async () => {
			if (paused) {
				await tick();
				currentZoomLevel = 1;
				draw(videoRef, $videoStatus.currentTime);
			}
		});
		const unsubscribeVideoStatusStore = videoStatus.subscribe(() => {
			currentTime = $videoStatus.currentTime;
		});
		backgroundImageRef.addEventListener('load', () => draw(videoRef, $videoStatus.currentTime), {
			signal
		});

		$videoStatus.currentTime = $edits.startAt;

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
		class="hidden"
		src={$recording?.url}
		bind:currentTime
		bind:paused
		bind:ended
		bind:this={videoRef}
		on:loadeddata={() => {
			pause();
			currentTime = $edits.startAt <= 0 ? Number.MIN_SAFE_INTEGER : $edits.startAt;
			draw(videoRef, currentTime);
		}}
		on:play={() => {
			animationId = window?.requestAnimationFrame(animate);

			if (
				ended ||
				$videoStatus.currentTime >= $edits.endAt ||
				$videoStatus.currentTime === $edits.startAt
			) {
				$currentZoomIndex = 0;
				currentZoomLevel = 1;
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
				pause();
			}
		}}
		on:seeked={() => {
			if (
				$videoStatus.currentTime < $currentZoom?.start ||
				$videoStatus.currentTime > $currentZoom?.end + ZOOM_TRANSITION_DURATION
			) {
				currentZoomLevel = 1;
			}

			if ($videoStatus.currentTime < $currentZoom?.start) {
				$currentZoomIndex = Math.max(0, $currentZoomIndex - 1);
			} else if ($videoStatus.currentTime > $currentZoom?.end + ZOOM_TRANSITION_DURATION) {
				$currentZoomIndex = Math.min($zooms.length - 1, $currentZoomIndex + 1);
			}

			draw(videoRef, $videoStatus.currentTime);
		}}
	/>
	<canvas
		width="1920"
		height="1080"
		class="max-w-full h-fit max-h-full object-contain rounded-md"
		bind:this={canvasRef}
	/>
</div>
