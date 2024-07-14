import { MP4Clip } from '@webav/av-cliper';
import { ArrayBufferTarget, Muxer } from 'mp4-muxer';
import { CODEC, FPS, KEYFRAME_SEPARATION_IN_SECONDS } from '$lib/utils/constants';
import { MICROSECONDS_PER_SECOND } from './constants';

interface ExtractVideoFramesParams {
	url: string;
}

type GenerateVideoParams = ExtractVideoFramesParams & {
	renderer: (frame: VideoFrame, time: number) => CanvasImageSource;
};

const WIDTH = 1920;
const HEIGHT = 1080;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function* extractVideoFrames({ url }: ExtractVideoFramesParams) {
	const res = await fetch(url);
	const video = new MP4Clip(res?.body);
	let frames: VideoFrame[] = [];
	let time = 0;

	await video.ready;

	while (true) {
		const { state, video: frame } = await video.tick(time);

		if (state === 'done') break;
		if (!frame) {
			time += 100;

			continue;
		}

		frames.push(frame);

		if (frames.length >= 10) {
			yield frames;

			frames = [];
		}

		time += frame?.duration ?? 0;
	}

	video.destroy();

	yield frames;
}

export async function generateVideo({ url, renderer }: GenerateVideoParams) {
	const extractor = extractVideoFrames({ url });
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
	let encodedFrames = 0;
	let nextKeyFrameTimestamp = -Infinity;

	encoder.configure({
		codec: CODEC,
		width: WIDTH,
		height: HEIGHT,
		alpha: 'discard',
		latencyMode: 'quality'
	});

	for await (const frames of extractor) {
		for (const frame of frames) {
			const time = 0 + encodedFrames / FPS;
			const canvas = renderer(frame, time);

			frame.close();

			const finalFrame = new VideoFrame(canvas, {
				timestamp: time * MICROSECONDS_PER_SECOND,
				duration: (1 / FPS) * MICROSECONDS_PER_SECOND
			});
			let keyFrame = false;

			if (finalFrame.timestamp >= nextKeyFrameTimestamp) {
				keyFrame = true;
				nextKeyFrameTimestamp =
					finalFrame.timestamp + KEYFRAME_SEPARATION_IN_SECONDS * MICROSECONDS_PER_SECOND;
			}

			encoder.encode(finalFrame, { keyFrame });

			finalFrame.close();

			encodedFrames++;

			await sleep(25);
		}
	}

	await encoder.flush();
	muxer.finalize();
	encoder.close();

	const { buffer } = muxer.target;

	return URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));
}
