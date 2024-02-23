import { FPS } from '$lib/utils/constants';
import EncodeWorker from '../workers/encode.worker?worker';
import { BPS } from './constants';

interface RecordingStorageInformation {
	folder: string;
	filename: string;
}

interface Params {
	onEnd?: (recording: RecordingStorageInformation) => void;
	onStart?: () => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function recordScreen({ ...params }: Params) {
	let worker: Worker;
	let stream: MediaStream;
	let recorder: MediaRecorder;

	async function start() {
		try {
			worker = new EncodeWorker();
			stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					frameRate: FPS
				}
			});
			recorder = new MediaRecorder(stream, {
				mimeType: 'video/webm',
				videoBitsPerSecond: BPS
			});

			worker.addEventListener('message', async (e) => {
				const { type, ...rest } = e.data;

				if (type === 'result') {
					params?.onEnd?.(rest);
				}
			});

			recorder.addEventListener('stop', () => {
				worker.postMessage({ type: 'end' });
			});

			recorder.start();

			// In Chrome, when recording a tab or a window, If I get the track settings inmediatelly, the `height` value is equals
			// to the screen height (not tab/window height). Also, a small "header" is shown when user is recording a tab.
			// The problem is: in the result video, I get a black rectangle at bottom because, at some point, the stream "fallbacks"
			// to the tab/window height. When recording a tab, the "header"'s height is removed too a few ms later. However, If I
			// wait a few seconds and then get the track details, I get the correct height value (only tab/window height).
			// TODO: Handle wait time in UI
			await sleep(1000);
			const track = stream.getVideoTracks()[0];
			const trackProcessor = new MediaStreamTrackProcessor({ track });
			const trackStream: ReadableStream = trackProcessor.readable;
			const trackSettings = track.getSettings();

			worker.postMessage(
				{
					type: 'start',
					trackStream,
					trackSettings,
					name: stream?.id
				},
				[trackStream]
			);
			params?.onStart?.();
		} catch (error) {
			console.log(error);
		}
	}

	function stop() {
		stream?.getTracks().forEach((track) => track.stop());
		recorder?.stop();
	}

	return {
		start,
		stop
	};
}
