<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { recording } from '$lib/stores/recording.store';

	export let currentTime: number;
	export let startAt: number;
	export let endAt: number;
	export let isTrimming: boolean;
	let isDragging = false;
	let seekbarRef: HTMLButtonElement;
	let dispatcher = createEventDispatcher();
	$: totalVideoDuration = $recording?.duration ?? 0;
	$: position = (currentTime * 100) / totalVideoDuration;

	function handleChangeTime(e: MouseEvent & { currentTarget: EventTarget & Document }) {
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

			position = newPosition;

			dispatcher('changeTime', { newTime });
		}
	}
</script>

<svelte:document
	on:mousemove={handleChangeTime}
	on:mouseup|preventDefault={() => (isDragging = false)}
/>

<button
	class="h-[calc(100%+8px)] px-2 absolute bottom-0 z-50 cursor-col-resize {currentTime <= startAt ||
	isDragging ||
	(isTrimming && (endAt <= currentTime || startAt >= currentTime))
		? 'transition-none'
		: 'transition-all ease-linear'}"
	style="--position: {position}%; left: calc(var(--position, 0%) - 8px);"
	on:mousedown|preventDefault={() => (isDragging = true)}
	bind:this={seekbarRef}
>
	<div class="h-full relative">
		<div class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2" />
		<div class="w-0.5 h-full bg-orange-hard" />
	</div>
</button>
