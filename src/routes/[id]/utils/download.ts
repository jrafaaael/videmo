export function download(filename: string, url: string) {
	const downloadElement = document.createElement('a');
	downloadElement.href = url;
	downloadElement.download = filename;
	downloadElement.click();
}
