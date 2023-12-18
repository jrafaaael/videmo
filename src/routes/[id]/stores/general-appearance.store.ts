import { writable } from 'svelte/store';

function createGeneralAppearence() {
	const { subscribe, set } = writable({
		padding: 24,
		cornerRadius: 12,
		shadow: {
			blur: 36,
			opacity: 50,
			x: 24,
			y: 24
		}
	});

	return {
		subscribe,
		set
	};
}

export const appearence = createGeneralAppearence();
