import bigSur from '$lib/assets/images/wallpapers/big-sur.webp';
import sonoma from '$lib/assets/images/wallpapers/sonoma.webp';
import ventura from '$lib/assets/images/wallpapers/ventura.webp';
import monterey from '$lib/assets/images/wallpapers/monterey.webp';

export const WALLPAPERS = [
	{ name: 'bigSur', url: bigSur },
	{ name: 'sonoma', url: sonoma },
	{ name: 'ventura', url: ventura },
	{ name: 'monterey', url: monterey }
] as const;

export type WallpaperNames = typeof WALLPAPERS[number]['name'];
