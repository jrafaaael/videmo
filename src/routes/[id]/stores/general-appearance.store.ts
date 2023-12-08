import { writable } from 'svelte/store';

function createGeneralAppearence() {
	const { subscribe, set } = writable({
		padding: 24,
		cornerRadius: 12
	});

	return {
		subscribe,
		set
	};
}

export const appearence = createGeneralAppearence();
