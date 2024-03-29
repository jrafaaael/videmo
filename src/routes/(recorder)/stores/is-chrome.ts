import { readable } from 'svelte/store';
import { browser } from '$app/environment';

export const isChrome = readable(browser && navigator.userAgent.indexOf('Chrome') !== -1);
