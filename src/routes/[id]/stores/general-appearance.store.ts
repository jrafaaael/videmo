import { writable } from 'svelte/store';

export const DEFAULT_VALUE = {
	padding: 24,
	cornerRadius: 12,
	shadow: {
		blur: 36,
		opacity: 50,
		x: 24,
		y: 24
	}
};

function createGeneralAppearence() {
	const { subscribe, set } = writable(DEFAULT_VALUE);

	function reset() {
		set(DEFAULT_VALUE);
	}

	return {
		subscribe,
		set,
		reset
	};
}

export const appearence = createGeneralAppearence();
