import { CODEC } from '$lib/utils/constants';
import { MP4Demuxer } from '../libs/mp4box/mp4-demuxer';

let decoder: VideoDecoder | null = null;
let demuxer: MP4Demuxer | null = null;

function onStartDecoding({ url }: { url: string }) {
	decoder = new VideoDecoder({
		output(frame) {
			console.log({ frame });
			frame.close();
		},
		error(e) {
			console.error(e);
		}
	});

	demuxer = new MP4Demuxer(url, {
		onConfig(config) {
			config.codec = CODEC;
			console.log(config);
			decoder?.configure(config);
		},
		onChunk(chunk) {
			console.log(chunk);
			decoder?.decode(chunk);
		},
		setStatus(status) {
			console.log(status);
		}
	});
}

function onStopDecoding() {
	console.log('stop');
}

const MESSAGE_HANLDER = {
	start: onStartDecoding,
	end: onStopDecoding,
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
