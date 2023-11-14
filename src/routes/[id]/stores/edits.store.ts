import { get, writable } from 'svelte/store';
import { recording } from '$lib/stores/recording.store';

function createEdits() {
	const { set, subscribe } = writable({
		startAt: 0,
		endAt: get(recording)?.duration
	});

	return {
		subscribe,
		set
	};
}

export const edits = createEdits();
