import { CODEC } from '$lib/utils/constants';
import { MP4Demuxer } from '../libs/mp4box/mp4-demuxer';

let decoder: VideoDecoder | null = null;
let demuxer: MP4Demuxer | null = null;

function onStartDecoding({ url }: { url: string }) {
	decoder = new VideoDecoder({
		output(frame) {
			self.postMessage(
				{
					type: 'frame',
					data: frame
				},
				{ transfer: [frame] }
			);

			frame.close();
		},
		error(e) {
			console.error(e);
		}
	});

	demuxer = new MP4Demuxer(url, {
		onConfig(config) {
			config.codec = CODEC;
			decoder?.configure(config);
		},
		onChunk(chunk) {
			decoder?.decode(chunk);
		},
		setStatus(status) {
			console.log(status);
		}
	});
}

async function onStopDecoding() {
	await decoder?.flush();
	decoder?.close();
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
