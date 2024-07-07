import { MP4Clip } from '@webav/av-cliper';

interface ExtractVideoFramesParams {
	url: string;
}

type GenerateVideoParams = ExtractVideoFramesParams;

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

export async function generateVideo({ url }: GenerateVideoParams) {
	const extractor = extractVideoFrames({ url });

	for await (const values of extractor) {
		console.log(values);
		values.forEach((v) => v.close());
	}
}
