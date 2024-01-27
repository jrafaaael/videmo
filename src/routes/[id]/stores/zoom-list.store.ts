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

	function _clear() {
		_zooms.set([]);
	}

	return {
		subscribe: sorted.subscribe,
		addZoom,
		updateZoomById,
		_clear
	};
}

export const zoomList = createZoomList();
