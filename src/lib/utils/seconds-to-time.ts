const DEFAULT_CONFIG = {
	showMilliseconds: false
};

export function secondsToTime(time: number, { showMilliseconds } = DEFAULT_CONFIG) {
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;
	const milliseconds = (time - Math.floor(time)) * 100;

	const formattedMinutes = minutes.toString(10).padStart(2, '0');
	const formattedSeconds = Math.floor(seconds).toString(10).padStart(2, '0');
	const formattedMilliseconds = Math.floor(milliseconds).toString(10).padStart(2, '0');

	return showMilliseconds
		? `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`
		: `${formattedMinutes}:${formattedSeconds}`;
}
