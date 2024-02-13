<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import { videoStatus } from './stores/video-status.store';
	import Header from './components/header.svelte';
	import Toolbox from './components/toolbox/toolbox.svelte';
	import Video from './components/video.svelte';
	import Controls from './components/controls.svelte';
	import Timeline from './components/timeline.svelte';
	import Seeker from './components/seeker.svelte';
	import Trimmer from './components/trimmer.svelte';
	import ZoomList from './components/zoom-list.svelte';
	import { secondsToTime } from './utils/seconds-to-time';
	import { getBlobDuration } from '../(recorder)/utils/get-blob-duration';

	let videoRef: Video;
	let paused = true;
	let ended: boolean;
	let isTrimming = false;

	onMount(async () => {
		try {
			const folderName = $page.params.id;
			const root = await navigator.storage.getDirectory();
			const folder = await root.getDirectoryHandle(folderName);

			for await (let [name] of folder) {
				const fileHandle = await folder.getFileHandle(name);
				const file = await fileHandle.getFile();
				const mp4 = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
				const duration = await getBlobDuration(mp4);

				recording.set({ id: '1', url: mp4, duration });
				edits.set({ startAt: 0, endAt: duration });
			}
		} catch (error) {
			console.error(error);
			goto('/');
		}
	});

	onDestroy(() => {
		URL.revokeObjectURL($recording?.url);
		recording.set(null);
		edits.set({ startAt: 0, endAt: Number.MAX_SAFE_INTEGER });
	});
</script>

<Header getFrameAsImage={videoRef?.exportFrameAsImage} getMP4={videoRef?.exportMP4} />

<main class="w-full h-[calc(100%-4rem)] bg-neutral-950 flex">
	<Toolbox />

	<section class="w-full flex-1 grid grid-rows-[minmax(0,1fr)_auto]">
		<div class="p-10 relative" id="video-wrapper">
			<Video bind:this={videoRef} bind:ended bind:paused />
		</div>

		<footer class="w-full bg-neutral-900 border-t-2 border-t-white/5">
			<div
				class="h-12 px-4 border-b-2 border-b-white/5 flex justify-center items-center gap-12 relative"
			>
				<span class="tabular-nums" title={$videoStatus.currentTime.toString(10)}>
					{secondsToTime(Math.floor($videoStatus.currentTime))}
				</span>
				<Controls
					{paused}
					on:changeVideoState={() => {
						paused ? videoRef.play() : videoRef.pause();
					}}
				/>
				<span class="text-white/50 tabular-nums" title={$recording?.duration.toString(10)}>
					{secondsToTime(Math.floor($recording?.duration ?? 0))}
				</span>
			</div>
			<div class="w-full h-12 px-10 border-b-2 border-b-white/5 flex items-end">
				<Timeline />
			</div>
			<div class="w-full px-10 bg-neutral-950">
				<div class="w-full py-6 flex flex-col gap-4 relative">
					<Seeker
						startAt={$edits.startAt}
						endAt={$edits.endAt}
						{isTrimming}
						on:changeTime={({ detail }) => {
							videoRef.pause();
							$videoStatus.currentTime = detail.newTime;
						}}
					/>
					<Trimmer
						bind:isTrimming
						on:resizeStart={() => videoRef.pause()}
						on:startChange={({ detail }) => {
							$edits.startAt = detail.startAt;

							if ($edits.startAt >= $videoStatus.currentTime) {
								$videoStatus.currentTime = detail.startAt;
							}
						}}
						on:endChange={({ detail }) => {
							$edits.endAt = detail.endAt;

							if ($edits.endAt <= $videoStatus.currentTime) {
								$videoStatus.currentTime = detail.endAt;
							}
						}}
					/>
					<ZoomList />
				</div>
			</div>
		</footer>
	</section>
</main>

<style>
	/* https://codepen.io/jh3y/pen/oNVwLpK */
	#video-wrapper::before {
		--line: hsla(0, 0%, 95%, 0.03);
		content: '';
		height: 100%;
		width: 100%;
		position: absolute;
		background: linear-gradient(90deg, var(--line) 2px, transparent 2px 4vmin) 0 -2vmin / 4vmin 4vmin,
			linear-gradient(var(--line) 2px, transparent 2px 4vmin) 0 -2vmin / 4vmin 4vmin;
		inset: 0;
		transform: translate3d(0, 0, -100vmin);
	}
</style>
