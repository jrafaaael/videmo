import { writable } from 'svelte/store';

function createEdits() {
	const { set, subscribe } = writable({
		startAt: 0,
		endAt: Number.MAX_SAFE_INTEGER
	});

	return {
		subscribe,
		set
	};
}

export const edits = createEdits();
