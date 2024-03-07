export async function saveFile(file: File, path: string) {
	if (path.startsWith('/')) throw new Error("path shouldn't start with /");

	const [filename, ...folders] = path.split('/').toReversed();
	const root = await navigator.storage.getDirectory();
	let fileParentHandle: FileSystemDirectoryHandle;

	for (const folder of folders.toReversed()) {
		const dir = fileParentHandle ?? root;

		fileParentHandle = await dir.getDirectoryHandle(folder, { create: true });
	}

	const fileHandle = await fileParentHandle.getFileHandle(filename, { create: true });
	const writable = await fileHandle.createWritable();
	await writable.write(file);
	await writable.close();
}
