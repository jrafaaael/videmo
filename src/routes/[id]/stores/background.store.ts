import { writable } from 'svelte/store';
import { WALLPAPERS } from '../utils/constants';

export const DEFAULT_VALUE = WALLPAPERS.at(0);

export const background = writable<string | { name: string; url: string }>(WALLPAPERS.at(0));
