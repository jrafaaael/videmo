<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';

	export let startAt: number;
	export let endAt: number;
	export let isTrimming: boolean;
	let isDragging = false;
	let seekbarRef: HTMLButtonElement;
	let dispatcher = createEventDispatcher();
	$: totalVideoDuration = $recording?.duration ?? 1;
	$: position = +(($videoStatus.currentTime * 100) / totalVideoDuration).toFixed(2);

	function handleSeeking(e: MouseEvent) {
		if (isDragging) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const constrains = seekbarRef.parentElement!.getBoundingClientRect();
			const positionInPx = Math.min(Math.max(e.clientX - constrains.left, 0), constrains.width);
			const positionInPercentage = (positionInPx * 100) / constrains.width;
			const startPosition = (startAt * constrains.width) / totalVideoDuration;
			const startPositionInPercentage = (startPosition * 100) / constrains.width;
			const endPosition = (endAt * constrains.width) / totalVideoDuration;
			const endPositionInPercentage = (endPosition * 100) / constrains.width;
			const newPosition = Math.max(
				startPositionInPercentage,
				Math.min(positionInPercentage, endPositionInPercentage)
			);
			const newTime = (newPosition * totalVideoDuration) / 100;

			dispatcher('changeTime', { newTime });
		}
	}

	function handleSeekEnd() {
		isDragging = false;
	}

	onMount(() => {
		document.addEventListener('mousemove', (e) => handleSeeking(e));
		document.addEventListener('mouseup', handleSeekEnd);

		return () => {
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
	class="h-[calc(100%+8px)] px-2 absolute bottom-0 z-50 cursor-col-resize {$videoStatus.currentTime <=
		startAt ||
	isDragging ||
	(isTrimming && (endAt <= $videoStatus.currentTime || startAt >= $videoStatus.currentTime))
		? 'transition-none'
		: 'transition-[left] ease-linear duration-100'}"
	style="--position: {position}%; left: calc(var(--position, 0%) - 8px);"
	on:mousedown|preventDefault={() => (isDragging = true)}
	bind:this={seekbarRef}
>
	<div class="h-full relative">
		<div class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2" />
		<div class="w-0.5 h-full bg-orange-hard" />
	</div>
</button>
