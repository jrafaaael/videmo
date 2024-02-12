import { writable } from 'svelte/store';
import type { Recording } from '$lib/types/recording';
import { FPS } from '$lib/utils/constants';
import EncodeWorker from '../workers/encode.worker?worker';
import { getBlobDuration } from './get-blob-duration';
import { BPS } from './constants';

interface Params {
	onEnd?: (recording: Recording) => void;
	onStart?: () => void;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createScreenRecorder(params?: Params) {
	const { subscribe, set } = writable({ isRecording: false });
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
				if (e.data.type === 'result') {
					const url = e.data.url;
					const duration = await getBlobDuration(url);

					params?.onEnd?.({
						id: stream?.id,
						url,
						duration
					});
				}
			});

			recorder.addEventListener('stop', () => {
				worker.postMessage({ type: 'end' });
				set({ isRecording: false });
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
			set({ isRecording: true });
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
		subscribe,
		start,
		stop
	};
}
