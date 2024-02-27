import { writable } from 'svelte/store';
import { type WallpaperNames, WALLPAPERS } from '../utils/constants';

const DEFAULT_VALUE = WALLPAPERS.at(0)!;

function createBackground() {
	const { subscribe, set } = writable(DEFAULT_VALUE);

	function updateBackground(wallpaperName: WallpaperNames) {
		set(WALLPAPERS.find(({ name }) => wallpaperName === name) ?? WALLPAPERS[0]);
	}

	function reset() {
		set(DEFAULT_VALUE);
	}

	return {
		subscribe,
		updateBackground,
		reset
	};
}

export const background = createBackground();
