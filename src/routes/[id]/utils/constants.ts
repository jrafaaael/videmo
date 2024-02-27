import bigSur from '$lib/assets/images/wallpapers/big-sur.webp';
import monterey from '$lib/assets/images/wallpapers/monterey.webp';
import sonoma from '$lib/assets/images/wallpapers/sonoma.webp';
import ventura from '$lib/assets/images/wallpapers/ventura.webp';

export const MICROSECONDS_PER_SECOND = 1_000_000;
export const MIN_ZOOM_LEVEL = 1;
export const MAX_ZOOM_LEVEL = 2;
export const ZOOM_TRANSITION_DURATION = 0.25;

export const WALLPAPERS = [
	{ name: 'bigSur', url: bigSur },
	{ name: 'monterey', url: monterey },
	{ name: 'sonoma', url: sonoma },
	{ name: 'ventura', url: ventura },
] as const;

export type WallpaperNames = typeof WALLPAPERS[number]['name'];
