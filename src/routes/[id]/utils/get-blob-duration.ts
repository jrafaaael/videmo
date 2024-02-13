export async function getBlobDuration(blob: string): Promise<number> {
	const tmpVideo = document.createElement('video');

	const duration = new Promise((resolve: (value: number) => void) => {
		tmpVideo.addEventListener('loadedmetadata', () => {
			// https://stackoverflow.com/questions/38443084/how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
			// Chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=642012
			if (tmpVideo.duration === Infinity) {
				tmpVideo.currentTime = Number.MAX_SAFE_INTEGER;

				tmpVideo.addEventListener('timeupdate', () => {
					resolve(tmpVideo.duration);
				});
			} else {
				resolve(tmpVideo.duration);
			}
		});
	});

	tmpVideo.preload = 'metadata';
	tmpVideo.src = blob;

	return await duration;
}
