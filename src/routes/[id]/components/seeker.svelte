<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import { recording } from '../stores/recording.store';
	import { cuts } from '../stores/cuts.store';
	import { videoStatus } from '../stores/video-status.store';
	import { isEditingTrim } from '../stores/is-editing-trim.store';

	let isDragging = false;
	let seekbarRef: HTMLButtonElement;
	let dispatcher = createEventDispatcher();
	$: totalVideoDuration = $recording?.duration!;
	$: position = +(($videoStatus.currentTime * 100) / totalVideoDuration).toFixed(2);

	function handleSeeking(e: MouseEvent) {
		if (isDragging) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const constrains = seekbarRef.parentElement!.getBoundingClientRect();
			const positionInPx = Math.min(Math.max(e.clientX - constrains.left, 0), constrains.width);
			const positionInPercentage = (positionInPx * 100) / constrains.width;
			const startPosition = ($cuts.at(0)!.startAt * constrains.width) / totalVideoDuration;
			const startPositionInPercentage = (startPosition * 100) / constrains.width;
			const endPosition = ($cuts.at(-1)!.endAt * constrains.width) / totalVideoDuration;
			const endPositionInPercentage = (endPosition * 100) / constrains.width;
			const newPosition = Math.max(
				startPositionInPercentage,
				Math.min(positionInPercentage, endPositionInPercentage)
			);
			const newTime = +((newPosition * totalVideoDuration) / 100).toFixed(2);

			dispatcher('changeTime', {
				newTime: Math.min($cuts.endAt, newTime)
			});
		}
	}

	function handleSeekEnd() {
		isDragging = false;
	}

	onMount(() => {
		const unsubscribe = cuts.subscribe(({ startAt, endAt }) => {
			$videoStatus.currentTime = Math.max(startAt, Math.min($videoStatus.currentTime, endAt));
		});

		document.addEventListener('mousemove', (e) => handleSeeking(e));
		document.addEventListener('mouseup', handleSeekEnd);

		return () => {
			unsubscribe();
			document.removeEventListener('mousemove', handleSeeking);
			document.removeEventListener('mouseup', handleSeekEnd);
		};
	});
</script>

<!-- BUG: `mouseup` event on `svelte:document` fires `input` event on numeric input indefinitely -->
<!-- <svelte:document
	on:mousemove={handleChangeTime}
	on:mouseup|preventDefault={() => (isDragging = false)}
/> -->

<button
	class="group h-[calc(100%+8px)] px-2 absolute bottom-0 z-20 cursor-col-resize {$videoStatus.currentTime <=
		$cuts.at(0)?.startAt ||
	isDragging ||
	($isEditingTrim &&
		($cuts.at(-1)?.endAt <= $videoStatus.currentTime ||
			$cuts.at(0)?.startAt >= $videoStatus.currentTime))
		? 'transition-none'
		: 'transition-[left] ease-linear duration-100'}"
	style="--position: {position}%; left: calc(var(--position, 0%) - 8px);"
	on:mousedown|preventDefault={() => (isDragging = true)}
	bind:this={seekbarRef}
>
	<div class="h-full relative">
		<output
			class="py-1 px-2 bg-neutral-300 rounded-md text-neutral-800 text-xs hidden absolute top-0 left-1/2 z-50 -translate-y-8 -translate-x-1/2 tabular-nums group-active:block"
		>
			{secondsToTime($videoStatus.currentTime, { showMilliseconds: true })}
		</output>
		<div class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2" />
		<div class="w-0.5 h-full bg-orange-hard" />
	</div>
</button>
