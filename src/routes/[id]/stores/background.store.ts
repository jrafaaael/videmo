import { writable } from 'svelte/store';
import { type WallpaperNames, WALLPAPERS } from '../utils/wallpapers';

function createBackground() {
	const { subscribe, set } = writable(WALLPAPERS.at(0));

	function updateBackground(wallpaperName: WallpaperNames) {
		set(WALLPAPERS.find(({ name }) => wallpaperName === name) ?? WALLPAPERS[0]);
	}

	return {
		subscribe,
		updateBackground
	};
}

export const background = createBackground();
