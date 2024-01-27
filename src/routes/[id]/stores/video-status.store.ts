import { writable } from 'svelte/store';

export const videoStatus = writable({
	currentTime: 0
});
