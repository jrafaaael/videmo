import bigSur from '$lib/assets/images/wallpapers/big-sur.webp';
import bigSurDark from '$lib/assets/images/wallpapers/big-sur-dark.webp';
import monterey from '$lib/assets/images/wallpapers/monterey.webp';
import montereyBlue from '$lib/assets/images/wallpapers/monterey-blue.webp';
import sequoia from '$lib/assets/images/wallpapers/sequoia-light.webp';
import sequoiaDark from '$lib/assets/images/wallpapers/sequoia-dark.webp';
import sonoma from '$lib/assets/images/wallpapers/sonoma.webp';
import sonomaDark from '$lib/assets/images/wallpapers/sonoma-dark.webp';
import stock17_1 from '$lib/assets/images/wallpapers/stock-ipados-17-1.webp';
import stock17_2 from '$lib/assets/images/wallpapers/stock-ipados-17-2.webp';
import ventura from '$lib/assets/images/wallpapers/ventura.webp';
import venturaDark from '$lib/assets/images/wallpapers/ventura-dark.webp';

export const MICROSECONDS_PER_SECOND = 1_000_000;
export const MIN_ZOOM_LEVEL = 1;
export const MAX_ZOOM_LEVEL = 2;
export const ZOOM_TRANSITION_DURATION = 1;
export const MIN_CUT_DURATION_IN_SECONDS = 1;

export const WALLPAPERS = [
	{ name: 'bigSur', url: bigSur },
	{ name: 'bigSurDark', url: bigSurDark },
	{ name: 'monterey', url: monterey },
	{ name: 'montereyBlue', url: montereyBlue },
	{ name: 'sequoia', url: sequoia },
	{ name: 'sequoiaDark', url: sequoiaDark },
	{ name: 'sonoma', url: sonoma },
	{ name: 'sonomaDark', url: sonomaDark },
	{ name: 'stock17_1', url: stock17_1 },
	{ name: 'stock17_2', url: stock17_2 },
	{ name: 'ventura', url: ventura },
	{ name: 'venturaDark', url: venturaDark }
];

export const COLORS = [
	'#fff',
	'#333',
	'#e2e8f0',
	'#d9f99d',
	'#bfdbfe',
	'#a7f3d0',
	'#fde68a',
	'#e879f9',
	'#c084fc',
	'#fecdd3'
];
