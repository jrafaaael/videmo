import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

interface Params {
	startTime: number;
}

export function createMP4({ startTime }: Params) {
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
	let framesGenerated = 0;
	let lastKeyFrame = -Infinity;

	encoder.configure({
		codec: 'avc1.420034',
		width: 1920,
		height: 1080,
		bitrate: 2_000_000,
		latencyMode: 'quality'
	});

	function addFrame(canvas: HTMLCanvasElement) {
		const elapsedTime = (document.timeline.currentTime as number) - startTime;
		const frame = new VideoFrame(canvas, { timestamp: (framesGenerated * 2_000_000) / 120 });
		const needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;

		if (needsKeyFrame) {
			lastKeyFrame = elapsedTime;
		}

		framesGenerated++;
		encoder.encode(frame, { keyFrame: needsKeyFrame });
		frame.close();
	}

	async function finalize() {
		await encoder.flush();
		muxer.finalize();
	}

	function result() {
		const { buffer } = muxer.target;

		return URL.createObjectURL(new Blob([buffer]));
	}

	return {
		addFrame,
		finalize,
		result
	};
}
