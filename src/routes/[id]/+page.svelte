<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto, beforeNavigate } from '$app/navigation';
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import { recording } from './stores/recording.store';
	import { cuts } from './stores/cuts.store';
	import { videoStatus } from './stores/video-status.store';
	import { DEFAULT_VALUE as DEFAULT_BACKGROUND, background } from './stores/background.store';
	import {
		DEFAULT_VALUE as DEFAULT_APPEARENCE,
		appearence
	} from './stores/general-appearance.store';
	import { zooms } from './stores/zooms.store';
	import { crop } from './stores/crop.store';
	import { getBlobDuration } from './utils/get-blob-duration';
	import Header from './components/header.svelte';
	import Toolbox from './components/toolbox/toolbox.svelte';
	import Video from './components/video.svelte';
	import Controls from './components/controls.svelte';
	import Timeline from './components/timeline.svelte';
	import Seeker from './components/seeker.svelte';
	import Trimmer from './components/trimmer.svelte';
	import ZoomList from './components/zoom-list.svelte';
	import CropDialog from './components/crop.dialog.svelte';
	import Cut from './components/cut.svelte';

	let videoRef: Video;
	let paused = true;

	onMount(async () => {
		try {
			const folderName = $page.params.id;
			const values = localStorage.getItem(folderName)
				? JSON.parse(localStorage.getItem(folderName)!)
				: null;

			zooms.load(values?.zooms ?? []);
			$background = values?.background ?? DEFAULT_BACKGROUND;
			$appearence = values?.appearence ?? DEFAULT_APPEARENCE;
			$crop = values?.crop ? values?.crop : null;

			const root = await navigator.storage.getDirectory();
			const folder = await root.getDirectoryHandle(folderName);

			for await (let [name] of folder) {
				const fileHandle = await folder.getFileHandle(name);
				const file = await fileHandle.getFile();
				const mp4 = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
				const duration = await getBlobDuration(mp4);

				recording.set({ id: '1', url: mp4, duration });
				$cuts =
					values?.cuts ??
					(values?.trimmings ? [values.trimmings] : [{ startAt: 0, endAt: duration }]);
			}
		} catch (error) {
			console.error(error);
			goto('/');
		}
	});

	beforeNavigate(() => {
		const previousConfig = JSON.parse(localStorage.getItem($page.params.id) ?? '{}');
		const url = $recording?.url;
		const values = {
			...previousConfig,
			background: $background,
			appearence: $appearence,
			zooms: $zooms,
			cuts: $cuts,
			crop: $crop
		};

		localStorage.setItem($page.params.id, JSON.stringify(values));
		URL.revokeObjectURL(url!);

		recording.set(null);
		cuts.reset();
	});
</script>

<Header getFrameAsImage={videoRef?.exportFrameAsImage} getMP4={videoRef?.exportMP4} />

<main class="w-full h-[calc(100dvh-4rem)] bg-neutral-950 flex overflow-hidden">
	<Toolbox />

	<section class="w-full flex-1 grid grid-rows-[minmax(0,1fr)_auto]">
		<div class="p-10 relative" id="video-wrapper">
			{#if $recording}
				<Video bind:this={videoRef} bind:paused />
			{/if}
		</div>

		<footer class="w-full bg-neutral-900 border-t-2 border-t-white/5">
			<div
				class="h-12 px-4 border-b-2 border-b-white/5 flex justify-center items-center gap-12 relative"
			>
				<Cut />
				<span
					class="tabular-nums select-none"
					title={secondsToTime($videoStatus.currentTime, { showMilliseconds: true })}
				>
					{secondsToTime(Math.floor($videoStatus.currentTime))}
				</span>
				<Controls
					{paused}
					on:changeVideoState={() => {
						paused ? videoRef.play() : videoRef.pause();
					}}
				/>
				<span
					class="text-white/50 tabular-nums select-none"
					title={secondsToTime($recording?.duration ?? 0, { showMilliseconds: true })}
				>
					{secondsToTime(Math.floor($recording?.duration ?? 0))}
				</span>
				<CropDialog />
			</div>
			<div class="w-full h-12 px-10 border-b-2 border-b-white/5 flex items-end">
				<Timeline />
			</div>
			<div class="w-full px-10 bg-neutral-950">
				<div class="w-full py-8 flex flex-col gap-6 relative">
					<Seeker
						on:changeTime={({ detail }) => {
							videoRef.pause();
							$videoStatus.currentTime = detail.newTime;
						}}
					/>
					<div class="w-full h-10 relative">
						<Trimmer />
					</div>
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
