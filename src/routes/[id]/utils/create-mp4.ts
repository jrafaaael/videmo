import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { CODEC, FPS } from '$lib/utils/constants';
import DecodeWorker from '../workers/decode.worker?worker';
import { MICROSECONDS_PER_SECOND } from './constants';

interface CreateMP4Params {
	videoUrl: string;
	fps?: number;
	startAt: number;
	endAt: number;
	renderer: (frame: VideoFrame, time: number) => VideoFrame;
	onResult: ({ result }: { result: string }) => void;
}

const WIDTH = 1920;
const HEIGHT = 1080;
const KEYFRAME_SEPARATION_IN_SECONDS = 0.5;

export function createMP4({
	videoUrl,
	fps = FPS,
	startAt,
	endAt,
	renderer,
	onResult
}: CreateMP4Params) {
	const muxer = new Muxer({
		target: new ArrayBufferTarget(),
		video: {
			codec: 'avc',
			width: WIDTH,
			height: HEIGHT
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
	let decodeWorker: Worker | null = null;
	let pendingFrames: VideoFrame[] = [];
	let frameToDraw: VideoFrame | null = null;
	let intervalId: number | null = null;
	let encodedFrames = 0;
	let nextFrameTimestamp = -Infinity;
	let nextKeyFrameTimestamp = -Infinity;

	encoder.configure({
		codec: CODEC,
		width: WIDTH,
		height: HEIGHT,
		alpha: 'discard',
		latencyMode: 'quality'
	});

	function start() {
		decodeWorker = new DecodeWorker();

		decodeWorker.addEventListener('message', ({ data }) => {
			const { type, ...rest } = data;

			if (type === 'frame') {
				const frame: VideoFrame = rest.data;

				pendingFrames.push(frame);
			}
		});

		decodeWorker.postMessage({ type: 'start', url: videoUrl, trimStart: startAt, trimEnd: endAt });

		intervalId = setInterval(_encode, 100);
	}

	async function _encode() {
		// at start, decode may doesn't start yet so there aren't pending frames and not encoded frames yet.
		// closest to end, may haven't pending frames but may have time remaining to finish the recording
		// and `mux` needs to be dependant of time
		if (pendingFrames.length <= 0 && encodedFrames <= 0) {
			return;
		}

		const time = startAt + encodedFrames / fps;

		if (time >= endAt) {
			await _mux();
			return;
		}

		if (time * MICROSECONDS_PER_SECOND >= nextFrameTimestamp) {
			frameToDraw && frameToDraw?.close();

			frameToDraw = pendingFrames.shift() ?? null;
			nextFrameTimestamp = pendingFrames.at(0)?.timestamp ?? Infinity;
		}

		const frame = renderer(frameToDraw, time);
		let keyFrame = false;

		if (frame.timestamp >= nextKeyFrameTimestamp) {
			keyFrame = true;
			nextKeyFrameTimestamp = frame.timestamp + KEYFRAME_SEPARATION_IN_SECONDS * 1_000_000;
		}

		encoder.encode(frame, { keyFrame });

		frame.close();

		encodedFrames++;
	}

	async function _mux() {
		intervalId && clearInterval(intervalId);
		decodeWorker?.postMessage({
			type: 'end'
		});
		decodeWorker?.terminate();
		await encoder.flush();
		muxer.finalize();
		encoder.close();

		const { buffer } = muxer.target;
		const mp4 = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));

		onResult({ result: mp4 });

		decodeWorker = null;
		pendingFrames = [];
		frameToDraw = null;
		intervalId = null;
		encodedFrames = 0;
		nextFrameTimestamp = -Infinity;
		nextKeyFrameTimestamp = -Infinity;
	}

	return {
		start
	};
}
