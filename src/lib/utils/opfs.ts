export async function rename(oldHandle: FileSystemDirectoryHandle, newName: string) {
	const root = await navigator.storage.getDirectory();
	const newFolder = await root.getDirectoryHandle(newName, {
		create: true
	});

	for await (const [filename] of oldHandle) {
		const oldFile = await (await oldHandle.getFileHandle(filename)).getFile();
		const newFile = await newFolder.getFileHandle(filename, { create: true });
		const writable = await newFile.createWritable();

		await writable.write(oldFile);

		await writable.close();
	}

	await oldHandle.remove({ recursive: true });
}
