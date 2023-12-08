import { writable } from 'svelte/store';
import type { Recording } from '$lib/types/recording';
import EncodeWorker from '../workers/encode.worker?worker';
import { getBlobDuration } from './get-blob-duration';
import { BPS, FPS } from './constants';

interface Params {
	onEnd?: (recording: Recording) => void;
	onStart?: () => void;
}

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
				stream?.getTracks().forEach((track) => track.stop());
				worker.postMessage({ type: 'end' });
			});

			const track = stream.getVideoTracks()[0];
			const trackProcessor = new MediaStreamTrackProcessor({ track });
			const trackStream: ReadableStream = trackProcessor.readable;
			const trackSettings = track.getSettings();

			recorder.start();
			worker.postMessage(
				{
					type: 'start',
					trackStream,
					trackSettings
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
		recorder?.stop();
		set({ isRecording: false });
	}

	return {
		subscribe,
		start,
		stop
	};
}
