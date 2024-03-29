import { browser } from '$app/environment';
import { readable } from 'svelte/store';

export const isChrome = readable(browser && navigator.userAgent.indexOf('Chrome') !== -1);
