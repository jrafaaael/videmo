<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { ffmpeg } from '$lib/stores/ffmpeg.store';
	import { edits } from '$lib/stores/edits.store';
	import Download from './icons/download.svelte';
	import Trash from './icons/trash.svelte';

	async function process() {
		try {
			const { fetchFile } = await import('@ffmpeg/util');

			const filename = $recording?.id + '.webm';

			await $ffmpeg?.writeFile('input.webm', await fetchFile($recording?.url));
			await $ffmpeg?.exec([
				'-ss',
				$edits.startAt.toString(10),
				'-to',
				$edits.endAt.toString(10),
				'-i',
				'input.webm',
				'-c',
				'copy',
				'-copyts',
				filename
			]);
			const video = await $ffmpeg?.readFile(filename);

			if (!video) {
				throw new Error('something went wrong');
			}

			const downloadElement = document.createElement('a');
			const url = URL.createObjectURL(new Blob([video], { type: 'video/webm' }));
			downloadElement.href = url;
			downloadElement.download = filename;
			downloadElement.click();
			URL.revokeObjectURL(url);
		} catch (e) {
			console.log(e);
		}
	}
</script>

<header
	class="h-16 px-10 bg-neutral-900 border-b-2 border-b-white/5 shrink-0 flex justify-between items-center gap-8"
>
	<a
		href="/"
		class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
	>
		<div class="w-4 aspect-square">
			<Trash />
		</div>
	</a>
	<h1 class="text-xl font-bold flex">
		<span class="line-clamp-1 break-all grow shrink-0 basis-0">
			{$recording?.id}
		</span>
		<span class="text-neutral-500 grow-0 shrink basis-1">.webm</span>
	</h1>
	<button class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2" on:click={process}>
		<div class="w-4 aspect-square">
			<Download />
		</div>
		<span>Save</span>
	</button>
</header>
