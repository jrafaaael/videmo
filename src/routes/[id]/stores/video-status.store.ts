import { writable } from 'svelte/store';

interface VideoStatus {
	currentTime: number;
	ref: HTMLVideoElement | null;
}

export const DEFAULT_VALUE: VideoStatus = {
	currentTime: 0,
	ref: null
};

export const videoStatus = writable<VideoStatus>(DEFAULT_VALUE);
