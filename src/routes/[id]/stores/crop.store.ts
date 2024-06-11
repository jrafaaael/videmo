import { writable } from 'svelte/store';

export interface Crop {
	width: number;
	height: number;
	x: number;
	y: number;
}

export const crop = writable<Crop | null>(null);
