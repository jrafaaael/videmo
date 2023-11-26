<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { edits } from '$lib/stores/edits.store';
	import Header from './components/header.svelte';
	import Sidebar from './components/sidebar.svelte';
	import Video from './components/video.svelte';
	import Controls from './components/controls.svelte';
	import Timeline from './components/timeline.svelte';
	import Seeker from './components/seeker.svelte';
	import Trimmer from './components/trimmer.svelte';
	import { secondsToTime } from './utils/seconds-to-time';

	let videoRef: HTMLVideoElement;
	let currentTime = 0;
	let paused = true;
	let ended: boolean;
	let isTrimming = false;
</script>

<Header />

<main class="w-full h-[calc(100%-4rem)] bg-neutral-950 flex">
	<Sidebar />

	<section class="w-full flex-1 grid grid-rows-[minmax(0,1fr)_auto]">
		<div class="p-10">
			<Video bind:videoRef bind:currentTime bind:ended bind:paused />
		</div>

		<footer class="w-full bg-neutral-900 border-t-2 border-t-white/5">
			<div
				class="h-12 px-4 border-b-2 border-b-white/5 flex justify-center items-center gap-12 relative"
			>
				<span class="tabular-nums" title={currentTime.toString(10)}>
					{secondsToTime(Math.floor(currentTime))}
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
						{currentTime}
						startAt={$edits.startAt}
						endAt={$edits.endAt}
						{isTrimming}
						on:changeTime={({ detail }) => {
							videoRef.pause();
							currentTime = detail.newTime;
						}}
					/>
					<Trimmer
						bind:isTrimming
						on:resizeStart={() => videoRef.pause()}
						on:startChange={({ detail }) => {
							$edits.startAt = detail.startAt;

							if ($edits.startAt >= currentTime) {
								currentTime = detail.startAt;
							}
						}}
						on:endChange={({ detail }) => {
							$edits.endAt = detail.endAt;

							if ($edits.endAt <= currentTime) {
								currentTime = detail.endAt;
							}
						}}
					/>
				</div>
			</div>
		</footer>
	</section>
</main>
