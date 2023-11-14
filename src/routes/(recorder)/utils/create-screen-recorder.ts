import { writable } from 'svelte/store';
import type { Recording } from '$lib/types/recording';
import getBlobDuration from './get-blob-duration';

interface Params {
	onEnd?: (recording: Recording) => void;
	onStart?: () => void;
}

export function createScreenRecorder(params?: Params) {
	const { subscribe, set } = writable({ isRecording: false });
	let chunks: Blob[] = [];
	let stream: MediaStream;
	let recorder: MediaRecorder;

	async function start() {
		try {
			stream = await navigator.mediaDevices.getDisplayMedia();
			recorder = new MediaRecorder(stream, {
				mimeType: 'video/webm'
			});

			recorder.start();
			set({ isRecording: true });

			recorder.addEventListener('dataavailable', ({ data }) => chunks.push(data));

			recorder.addEventListener('stop', async () => {
				const videoBlob = new Blob(chunks, {
					type: 'video/webm'
				});
				const url = URL.createObjectURL(videoBlob);
				const duration = await getBlobDuration(url);

				params?.onEnd?.({
					id: stream?.id!,
					url: url,
					duration
				});
			});

			stream.getTracks().forEach((track) => {
				track.addEventListener('ended', () => stop());
			});

			params?.onStart?.();
		} catch (error) {
			console.log(error);
		}
	}

	async function stop() {
		recorder?.stop();
		stream?.getTracks().forEach((track) => track.stop());
		set({ isRecording: false });
	}

	return {
		subscribe,
		start,
		stop
	};
}
