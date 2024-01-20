import { writable } from 'svelte/store';

interface Zoom {
	id: number;
	start: number;
	end: number;
	x: number;
	y: number;
}

function createZoomList() {
	const { subscribe, update, set } = writable<Zoom[]>([]);

	function addZoom(zoom: Zoom) {
		update((list) => [...list, zoom]);
	}

	function updateZoomById(zoom: Zoom) {
		update((list) => list.map((current) => (current.id === zoom.id ? { ...zoom } : current)));
	}

	function _clear() {
		set([]);
	}

	return {
		subscribe,
		addZoom,
		updateZoomById,
		_clear
	};
}

export const zoomList = createZoomList();
