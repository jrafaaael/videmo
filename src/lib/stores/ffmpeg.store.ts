import { writable } from 'svelte/store';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

export const ffmpeg = writable<FFmpeg | null>(null);
