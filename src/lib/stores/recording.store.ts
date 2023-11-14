import { writable } from 'svelte/store';
import type { Recording } from '$lib/types/recording';

export const recording = writable<Recording | null>(null);

