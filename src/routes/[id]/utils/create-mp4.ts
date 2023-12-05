import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { download } from './download';

const canvasRef = new OffscreenCanvas(1920, 1080);
const ctx = canvasRef.getContext('2d')!;
const videoRef = document.createElement('video');
const backgroundImageRef = new Image();
const muxer = new Muxer({
	target: new ArrayBufferTarget(),
	video: {
		codec: 'avc',
		width: 1920,
		height: 1080
	},
	fastStart: 'in-memory',
	firstTimestampBehavior: 'offset'
});
const encoder = new VideoEncoder({
	output(chunk, metadata) {
		muxer.addVideoChunk(chunk, metadata);
	},
	error(e) {
		console.error(e);
	}
});
let animationId: number;
let framesGenerated = 0;
let startTime: number | null = null;
let lastKeyFrame: number | null = null;

function animate() {
	const VIDEO_NATURAL_WIDTH = videoRef?.videoWidth;
	const VIDEO_NATURAL_HEIGHT = videoRef?.videoHeight;
	const VIDEO_NATURAL_ASPECT_RATIO = VIDEO_NATURAL_WIDTH / VIDEO_NATURAL_HEIGHT;
	const p = 120;
	const width = Math.min(ctx.canvas.height * VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.width) - p;
	const height = Math.min(width / VIDEO_NATURAL_ASPECT_RATIO, ctx.canvas.height);
	// const left = (ctx.canvas.width - width) / 2;
	// const top = (ctx.canvas.height - height) / 2;
	// const zoom = sineIn(
	// 	interpolateZoomLevel({
	// 		time: currentTime,
	// 		zoomInStartTime: 2,
	// 		zoomOutStartTime: 4
	// 	})
	// );

	ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
	ctx?.drawImage(backgroundImageRef, 0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx?.drawImage(videoRef, 0, 0, width, height);

	if (!videoRef.ended) {
		const elapsedTime = (document.timeline.currentTime as number) - startTime;
		const frame = new VideoFrame(canvasRef, { timestamp: (framesGenerated * 1_000_000) / 60 });

		framesGenerated++;

		const needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
		if (needsKeyFrame) lastKeyFrame = elapsedTime;

		encoder.encode(frame, { keyFrame: needsKeyFrame });
		frame.close();

		animationId = window.requestAnimationFrame(animate);
	}
}

export function createMp4(url: string, backgroundUrl: string) {
	backgroundImageRef.src = backgroundUrl;
	videoRef.src = url;
	encoder.configure({
		codec: 'avc1.420034',
		width: 1920,
		height: 1080,
		bitrate: 1_000_000
	});

	videoRef.addEventListener('play', () => {
		startTime = document.timeline.currentTime as number;
		lastKeyFrame = -Infinity;
		animationId = window.requestAnimationFrame(animate);
	});
	videoRef.addEventListener('ended', async () => {
		window.cancelAnimationFrame(animationId);
		await encoder.flush();
		muxer.finalize();

		const { buffer } = muxer.target; // Buffer contains final MP4 file
		const url = URL.createObjectURL(new Blob([buffer]));

		download('test.mp4', url);
	});

	videoRef.play();
}
