interface Params {
	time: number;
	zoomInStartTime: number;
	zoomOutStartTime: number;
	maxZoomLevel?: number;
}

const MIN_ZOOM_LEVEL = 1;
const ZOOM_DURATION = 1;

export function interpolateZoomLevel({
	time,
	zoomInStartTime,
	zoomOutStartTime,
	maxZoomLevel = 2
}: Params) {
	const zoomInEndTime = zoomInStartTime + ZOOM_DURATION;
	const zoomOutEndTime = zoomOutStartTime + ZOOM_DURATION;

	if (time >= zoomInStartTime && time < zoomOutStartTime) {
		const progress = (time - zoomInStartTime) / (zoomInEndTime - zoomInStartTime);

		return Math.min(maxZoomLevel, MIN_ZOOM_LEVEL + progress * (maxZoomLevel - MIN_ZOOM_LEVEL));
	} else if (time >= zoomOutStartTime && time < zoomOutStartTime + ZOOM_DURATION) {
		const progress = (time - zoomOutStartTime) / (zoomOutEndTime - zoomOutStartTime);

		return Math.max(MIN_ZOOM_LEVEL, maxZoomLevel - progress * (maxZoomLevel - MIN_ZOOM_LEVEL));
	} else {
		return MIN_ZOOM_LEVEL;
	}
}
