import { MP4Clip } from '@webav/av-cliper';
import { MICROSECONDS_PER_SECOND } from './constants';

interface ExtractVideoFramesParams {
	url: string;
}

type GenerateVideoParams = ExtractVideoFramesParams;

async function extractVideoFrames({ url }: ExtractVideoFramesParams) {
	const res = await fetch(url);
	const video = new MP4Clip(res?.body);
	let time = 0;

	await video.ready;

	while (true) {
		const { state, video: frame } = await video.tick(time);

		if (state === 'done') break;
		if (frame !== null && state === 'success') frame?.close();
		if (!frame) {
			time += 100;

			continue;
		}

		console.log(frame, time / MICROSECONDS_PER_SECOND);

		time += frame?.duration ?? 0;
	}

	video.destroy();
}

export async function generateVideo({ url }: GenerateVideoParams) {
	await extractVideoFrames({ url });
}
