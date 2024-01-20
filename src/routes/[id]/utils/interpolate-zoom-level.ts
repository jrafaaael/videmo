interface Params {
	currentTime: number;
	start: number;
	end: number;
}

const MIN_ZOOM_LEVEL = 1;
const MAX_ZOOM_LEVEL = 2;
const ZOOM_TRANSITION_DURATION = 0.25;

export function interpolateZoomLevel({ currentTime, start, end }: Params) {
	const zoomInEnd = start + ZOOM_TRANSITION_DURATION;
	const zoomOutStart = end - ZOOM_TRANSITION_DURATION;

	if (currentTime >= start && currentTime < zoomOutStart) {
		const progress = (currentTime - start) / (zoomInEnd - start);

		return Math.min(MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL + progress * (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL));
	} else if (currentTime >= zoomOutStart && currentTime < end) {
		const progress = (currentTime - zoomOutStart) / (end - zoomOutStart);

		return Math.max(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL - progress * (MAX_ZOOM_LEVEL - MIN_ZOOM_LEVEL));
	} else {
		return MIN_ZOOM_LEVEL;
	}
}
