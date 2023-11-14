export function secondsToTime(time: number) {
	time = +time.toFixed(0);
	const minutes = Math.floor(+time.toFixed(0) / 60);
	const seconds = time - minutes * 60;

	return `${minutes.toString(10).padStart(2, '0')}:${seconds.toString(10).padStart(2, '0')}`;
}
