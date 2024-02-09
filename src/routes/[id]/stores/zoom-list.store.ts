import { derived, writable } from 'svelte/store';

interface Zoom {
	id: number;
	start: number;
	end: number;
	x: number;
	y: number;
}

function createZoomList() {
	const _zooms = writable<Zoom[]>([]);
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

	function _clear() {
		_zooms.set([]);
	}

	return {
		subscribe: sorted.subscribe,
		addZoom,
		updateZoomById,
		removeZoomById,
		_clear
	};
}

export const zoomList = createZoomList();
export const currentZoomIndex = writable(0);
export const currentZoom = derived(
	[zoomList, currentZoomIndex],
	([zooms, idx]) => zooms[idx] ?? null
);
