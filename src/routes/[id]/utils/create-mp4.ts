import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { CODEC } from '$lib/utils/constants';
import DecodeWorker from '../workers/decode.worker?worker';
import { FPS } from '../../(recorder)/utils/constants';

interface CreateMP4Params {
	canvas: HTMLCanvasElement;
	videoUrl: string;
	fps?: number;
	endAt: number;
	renderer: (frame: VideoFrame, time: number) => void;
	onResult: ({ result }: { result: string }) => void;
}

const WIDTH = 1920;
const HEIGHT = 1080;

export function createMP4({
	canvas,
	videoUrl,
	fps = FPS,
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
		fastStart: 'in-memory'
	});
	const encoder = new VideoEncoder({
		output(chunk, metadata) {
			muxer.addVideoChunk(chunk, metadata);
		},
		error(e) {
			console.error(e);
		}
	});
	const decodeWorker = new DecodeWorker();
	const pendingFrames: VideoFrame[] = [];
	let intervalId: number;
	let encodedFrames = 0;
	let nextFrameTimestamp = -Infinity;
	let frameToDraw: VideoFrame | null = null;

	encoder.configure({
		codec: CODEC,
		width: WIDTH,
		height: HEIGHT,
		alpha: 'discard',
		latencyMode: 'quality'
	});

	function start() {
		decodeWorker.addEventListener('message', ({ data }) => {
			const { type, ...rest } = data;

			if (type === 'frame') {
				const frame: VideoFrame = rest.data;

				pendingFrames.push(frame);
			}
		});

		decodeWorker.postMessage({ type: 'start', url: videoUrl });

		intervalId = setInterval(_encode, 100);
	}

	async function _encode() {
		if (pendingFrames.length <= 0 && encodedFrames <= 0) {
			return;
		}

		const time = encodedFrames / fps;

		if (time >= endAt) {
			await _mux();
			return;
		}

		if (time * 1_000_000 >= nextFrameTimestamp) {
			frameToDraw && frameToDraw?.close();

			frameToDraw = pendingFrames.shift() ?? null;
			nextFrameTimestamp = pendingFrames.at(0)?.timestamp ?? Infinity;
		}

		renderer(frameToDraw, time);

		const timestamp = (encodedFrames * 1_000_000) / fps;
		const frame = new VideoFrame(canvas, {
			timestamp
		});

		encoder.encode(frame, { keyFrame: encodedFrames % 2 === 0 });

		frame.close();

		encodedFrames++;
	}

	async function _mux() {
		clearInterval(intervalId);
		decodeWorker?.terminate();

		await encoder.flush();
		muxer.finalize();

		const { buffer } = muxer.target;
		const mp4 = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));

		onResult({ result: mp4 });
	}

	return {
		start
	};
}
