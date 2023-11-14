<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import Header from './components/header.svelte';
	import Controls from './components/controls.svelte';
	import Timeline from './components/timeline.svelte';
	import Seeker from './components/seeker.svelte';
	import Trimmer from './components/trimmer.svelte';
	import { secondsToTime } from './utils/seconds-to-time';
	import { edits } from './stores/edits.store';

	let videoRef: HTMLVideoElement;
	let paused = true;
	let ended: boolean;
	let isTrimming = false;
	$: currentTime = Math.max($edits.startAt, Math.min(currentTime ?? Infinity, $edits.endAt));
</script>

<main class="w-full h-full bg-neutral-950 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-4">
	<Header />

	<section class="w-full px-10 flex justify-center items-center">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			class="w-full max-h-full aspect-video"
			src={$recording?.url}
			bind:currentTime
			bind:paused
			bind:ended
			bind:this={videoRef}
			on:play={() => {
				if (ended || currentTime >= $edits.endAt) {
					currentTime = $edits.startAt;
				}
			}}
			on:timeupdate={() => {
				if (currentTime >= $edits.endAt) {
					videoRef.pause();
				}
			}}
		/>
	</section>

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
					on:changeTime={({ detail }) => (currentTime = detail.newTime)}
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
</main>
