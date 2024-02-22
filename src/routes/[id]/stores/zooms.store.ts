import { derived, get, writable } from 'svelte/store';

interface Zoom {
	id: number;
	start: number;
	end: number;
	x: number;
	y: number;
}

const DEFAULT_VALUE: Zoom[] = [];

function createZooms() {
	const _zooms = writable(DEFAULT_VALUE);
	const sorted = derived(_zooms, (zooms) => zooms.toSorted((a, b) => a.start - b.start));

	function addZoom(zoom: Zoom) {
		_zooms.update((list) => [...list, zoom]);
	}

	function updateZoomById(zoom: Zoom) {
		_zooms.update((list) =>
			list.map((current) => (current.id === zoom.id ? { ...zoom } : current))
		);
	}

	function removeZoomById(zoom: Zoom) {
		_zooms.update((list) => list.filter((current) => current.id !== zoom.id));
	}

	function load(zoomsToLoad: Zoom[]) {
		_zooms.set(zoomsToLoad);
	}

	function reset() {
		_zooms.set(DEFAULT_VALUE);
	}

	return {
		subscribe: sorted.subscribe,
		addZoom,
		updateZoomById,
		removeZoomById,
		load,
		reset
	};
}

export const zooms = createZooms();
export const currentZoomIndex = writable(0);
export const currentZoom = derived([zooms, currentZoomIndex], ([zooms, idx]) => zooms[idx] ?? null);
