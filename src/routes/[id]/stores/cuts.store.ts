import { derived, writable } from 'svelte/store';

interface Cut {
	startAt: number;
	endAt: number;
}

const DEFAULT_VALUE: Cut[] = [];

function createCutStore() {
	const _cuts = writable<Cut[]>([]);
	const cuts = derived(_cuts, (cut) => cut.toSorted((a, b) => a.startAt - b.startAt));

	function reset() {
		_cuts.set(DEFAULT_VALUE);
	}

	return {
		subscribe: cuts.subscribe,
		set: _cuts.set,
		reset
	};
}

export const cuts = createCutStore();
export const currentCutIndex = writable(0);
export const currentCut = derived([cuts, currentCutIndex], ([cuts, idx]) => cuts[idx] ?? null);
