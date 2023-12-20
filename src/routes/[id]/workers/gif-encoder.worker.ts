import { GIFEncoder, applyPalette, quantize } from 'gifenc';

const FORMAT = 'rgb444';
const encoder = GIFEncoder();
let isFirstFrame = true;

async function onStartEncoding() {
	console.log('starting');
}

function onEncodeFrame({ frame }: { frame: Uint8Array | Uint8ClampedArray }) {
	// If necessary, quantize your colors to a reduced palette
	const palette = quantize(frame, 256, { format: FORMAT });

	// Apply palette to RGBA data to get an indexed bitmap
	const index = applyPalette(frame, palette, FORMAT);

	// Write frame into GIF
	encoder.writeFrame(index, 1920, 1080, { palette, first: isFirstFrame });

	isFirstFrame = false;
}

async function onStopEncoding() {
	encoder.finish();

	isFirstFrame = true;

	const buffer = encoder.bytesView();
	const gif = URL.createObjectURL(new Blob([buffer], { type: 'image/gif' }));

	self.postMessage({
		type: 'result',
		url: gif
	});
}

const MESSAGE_HANLDER = {
	start: onStartEncoding,
	encode: onEncodeFrame,
	end: onStopEncoding,
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
