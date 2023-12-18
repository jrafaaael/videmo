import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { FPS } from '../utils/constants';

// https://aws.amazon.com/es/blogs/media/part-1-back-to-basics-gops-explained/
const GOP = 512;
let muxer: Muxer<FileSystemWritableFileStreamTarget> | null = null;
let encoder: VideoEncoder | null = null;

function onStartRecording({
	trackStream,
	trackSettings
}: {
	trackStream: ReadableStream<VideoFrame>;
	trackSettings: MediaTrackSettings;
}) {
	const reader = trackStream.getReader();
	const { width, height } = trackSettings;
	let frames = 0;

	if (!width || !height) {
		throw new Error('`width` and `height` needs to be specified');
	}

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
			muxer?.addVideoChunk(chunk, metadata);
		},
		error(e) {
			console.error(e);
		}
	});

	encoder.configure({
		codec: 'avc1.F4E034',
		width,
		height,
		displayWidth: width,
		displayHeight: height,
		framerate: FPS,
		bitrateMode: 'variable',
		latencyMode: 'quality'
	});

	reader.read().then(function processFrame({ done, value }) {
		if (done) {
			return;
		}

		const frame = value;
		const keyFrame = frames === 0;

		frames++;

		if (frames >= GOP) {
			frames = 0;
		}

		encoder?.encode(frame, { keyFrame });
		frame.close();

		reader.read().then(processFrame);
	});
}

async function onStopRecording() {
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