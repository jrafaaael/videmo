import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { CODEC, FPS, KEYFRAME_SEPARATION_IN_SECONDS } from '$lib/utils/constants';

let reader: ReadableStreamDefaultReader<VideoFrame> | null = null;
let muxer: Muxer<ArrayBufferTarget> | null = null;
let encoder: VideoEncoder | null = null;
let previousTimestamp = 0;
let nextKeyFrameTimestamp = -Infinity;

async function onStartRecording({
	trackStream,
	trackSettings
}: {
	trackStream: ReadableStream<VideoFrame>;
	trackSettings: MediaTrackSettings;
}) {
	const { width, height } = trackSettings;

	if (!width || !height) {
		throw new Error('`width` and `height` needs to be specified');
	}

	reader = trackStream.getReader();

	muxer = new Muxer({
		target: new ArrayBufferTarget(),
		video: {
			codec: 'avc',
			width,
			height
		},
		fastStart: 'in-memory',
		firstTimestampBehavior: 'offset'
	});
	encoder = new VideoEncoder({
		output(chunk, metadata) {
			/*
			 * sometimes I get the error `Error: Timestamps must be monotonically increasing` and recording has missing frames.
			 * this could be an error on chrome
			 */
			if (chunk.timestamp > previousTimestamp) {
				muxer?.addVideoChunk(chunk, metadata);

				previousTimestamp = chunk.timestamp;
			} else {
				const diff = previousTimestamp - chunk.timestamp;
				const timestamp = previousTimestamp + diff;

				muxer?.addVideoChunk(chunk, metadata, timestamp);
			}
		},
		error(e) {
			console.error(e);
		}
	});

	encoder.configure({
		codec: CODEC,
		width,
		height,
		displayWidth: width,
		displayHeight: height,
		framerate: FPS,
		latencyMode: 'quality'
	});

	reader.read().then(function processFrame({ done, value }) {
		if (done) {
			return;
		}

		const frame = value;
		let keyFrame = false;

		if (frame.timestamp >= nextKeyFrameTimestamp) {
			keyFrame = true;
			nextKeyFrameTimestamp = frame.timestamp + KEYFRAME_SEPARATION_IN_SECONDS * 1_000_000;
		}

		encoder?.encode(frame, { keyFrame });
		frame.close();

		reader?.read().then(processFrame);
	});
}

async function onStopRecording() {
	await reader?.cancel();
	await encoder?.flush();
	muxer?.finalize();

	const { buffer } = muxer.target;
	const mp4 = URL.createObjectURL(new Blob([buffer], { type: 'video/mp4' }));

	self.postMessage({
		type: 'result',
		url: mp4
	});
}

const MESSAGE_HANLDER = {
	start: onStartRecording,
	end: onStopRecording,
	default: () => {
		throw new Error('This type of message is not available');
	}
};

type Handlers = keyof typeof MESSAGE_HANLDER;

self.addEventListener('message', (e) => {
	const { type, ...rest }: { type: Handlers } = e.data;
	const handler = MESSAGE_HANLDER[type] ?? MESSAGE_HANLDER.default;

	handler(rest);
});
