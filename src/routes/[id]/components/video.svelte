<script lang="ts">
	import { onMount } from 'svelte';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { background } from '../stores/background.store';
	import { appearence } from '../stores/general-appearance.store';
	import { zoomList } from '../stores/zoom-list.store';
	import { createMP4 } from '../utils/create-mp4';
	import { lerp } from '../utils/lerp';
	import { MICROSECONDS_PER_SECOND, MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '../utils/constants';

	export let currentTime: number;
	export let paused: boolean;
	export let ended: boolean;
	let videoRef: HTMLVideoElement;
	let canvasRef: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let backgroundImageRef = new Image();
	let animationId: number;
	let currentZoomIndex = 0;
	let currentZoom = $zoomList.at(currentZoomIndex) ?? null;
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
		const shadow = $appearence.shadow;
		const width = Math.min(ctx.canvas.height * VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.width) - p;
		const height = Math.min(width / VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.height);
		const left = (ctx.canvas.width - width) / 2;
		const top = (ctx.canvas.height - height) / 2;

		if (currentZoom && frameTime >= currentZoom.end) {
			currentZoomIndex++;
			currentZoom = $zoomList.at(currentZoomIndex) ?? null;
		}

		const zoomInStart = currentZoom?.start ?? Infinity;
		const zoomInEnd = zoomInStart + 0.25;
		const zoomOutEnd = currentZoom?.end ?? Infinity;
		const zoomOutStart = zoomOutEnd - 0.25;
		const prevZoom = $zoomList[currentZoomIndex - 1];
		const nextZoom = $zoomList.at(currentZoomIndex + 1);
		const isInsideZoom = frameTime >= zoomInStart && frameTime <= zoomOutEnd;
		const isOverlappingNextZoom = nextZoom ? nextZoom?.start <= zoomOutEnd : false;
		const isOverlappingPrevZoom = prevZoom ? zoomInStart <= prevZoom?.end : false;
		let zoom = 1;
		let leftWithZoom = left;
		let topWithZoom = top;

		if (currentZoom && isInsideZoom && (isOverlappingPrevZoom || isOverlappingNextZoom)) {
			if (isOverlappingPrevZoom) {
				if (frameTime >= zoomInStart && frameTime <= zoomInEnd) {
					const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);

					const l = lerp(prevZoom?.x, currentZoom?.x, progress);
					const t = lerp(prevZoom.y, currentZoom?.y, progress);

					zoom = MAX_ZOOM_LEVEL;
					leftWithZoom = left - l * (zoom - 1);
					topWithZoom = top - t * (zoom - 1);
				} else if (frameTime >= zoomOutStart && !isOverlappingNextZoom) {
					const progress = (frameTime - zoomOutStart) / (zoomOutEnd - zoomOutStart);

					zoom = Math.max(MIN_ZOOM_LEVEL, lerp(MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, progress));
					leftWithZoom = left - currentZoom?.x * (zoom - 1);
					topWithZoom = top - currentZoom?.y * (zoom - 1);
				} else {
					zoom = MAX_ZOOM_LEVEL;
					leftWithZoom = left - currentZoom?.x * (zoom - 1);
					topWithZoom = top - currentZoom?.y * (zoom - 1);
				}
			} else if (isOverlappingNextZoom) {
				const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);

				zoom = Math.min(MAX_ZOOM_LEVEL, lerp(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, progress));
				leftWithZoom = left - currentZoom?.x * (zoom - 1);
				topWithZoom = top - currentZoom?.y * (zoom - 1);
			}
		} else if (currentZoom) {
			if (frameTime >= zoomInStart && frameTime <= zoomOutStart) {
				const progress = (frameTime - zoomInStart) / (zoomInEnd - zoomInStart);

				zoom = Math.min(MAX_ZOOM_LEVEL, lerp(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL, progress));
			} else if (frameTime >= zoomOutStart && frameTime <= zoomOutEnd) {
				const progress = (frameTime - zoomOutStart) / (zoomOutEnd - zoomOutStart);

				zoom = Math.max(MIN_ZOOM_LEVEL, lerp(MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, progress));
			}

			leftWithZoom = left - currentZoom?.x * (zoom - 1);
			topWithZoom = top - currentZoom?.y * (zoom - 1);
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
		on:seeked={() => {
			currentZoomIndex = $zoomList.findIndex(
				(zoom) => zoom.start >= currentTime || zoom.end >= currentTime
			);
			currentZoom = $zoomList.at(currentZoomIndex) ?? null;
			draw(videoRef, currentTime);
		}}
	/>
	<canvas width="1920" height="1080" class="rounded-md" bind:this={canvasRef} />
</div>
