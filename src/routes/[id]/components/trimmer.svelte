<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { recording } from '$lib/stores/recording.store';

	type Resizer = 'right' | 'left';

	export let isTrimming: boolean;
	const MINIMUM_DURATION_IN_SECONDS = 0.5;
	let resizer: Resizer | null = null;
	let trimmerRef: HTMLDivElement;
	let mousePositionWhenResizingStart: number | null = null;
	let trimmerRectWhenResizingStart: DOMRect | null = null;
	let dispatcher = createEventDispatcher();
	$: totalVideoDuration = $recording?.duration ?? 0;

	function handleResizeStart(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		direction: Resizer
	) {
		trimmerRectWhenResizingStart = trimmerRef.getBoundingClientRect();
		mousePositionWhenResizingStart = e.pageX;
		isTrimming = true;
		resizer = direction;
		dispatcher('resizeStart');
	}

	function handleResize(e: MouseEvent & { currentTarget: EventTarget & Document }) {
		if (
			!isTrimming ||
			!resizer ||
			!trimmerRectWhenResizingStart ||
			!mousePositionWhenResizingStart
		) {
			return;
		}

		const trimmerRect = trimmerRef.getBoundingClientRect();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const constrains = trimmerRef.parentElement!.getBoundingClientRect();
		const constrainPadding = constrains.left;

		if (resizer === 'right') {
			const delta = e.pageX - mousePositionWhenResizingStart;
			const width = Math.min(
				constrains.width,
				constrains.width - trimmerRect.left + constrains.left,
				trimmerRectWhenResizingStart.width + delta
			);
			const widthInPercentage = (width * 100) / constrains.width;
			const duration = (widthInPercentage * totalVideoDuration) / 100;

			if (duration >= MINIMUM_DURATION_IN_SECONDS) {
				trimmerRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');

				const deltaWidth = width - trimmerRect.width;
				const endAt =
					((trimmerRect.right + deltaWidth - constrainPadding) * totalVideoDuration) /
					(constrains.right - constrainPadding);

				dispatcher('endChange', { endAt: +endAt.toFixed(4) });
			}
		} else if (resizer === 'left') {
			const delta = mousePositionWhenResizingStart - e.pageX;
			const left = trimmerRectWhenResizingStart.left - delta - constrains.left;
			const width = Math.min(
				constrains.width,
				trimmerRectWhenResizingStart.width + delta,
				trimmerRectWhenResizingStart.width + left + delta
			);
			const widthInPercentage = (width * 100) / constrains.width;
			const leftInPercentage = Math.max(0, (left * 100) / constrains.width);
			const duration = (widthInPercentage * totalVideoDuration) / 100;

			if (duration >= MINIMUM_DURATION_IN_SECONDS) {
				trimmerRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
				trimmerRef.style.setProperty('left', leftInPercentage.toFixed(1) + '%');

				const deltaWidth = width - trimmerRect.width;
				const startAt =
					((trimmerRect.left - deltaWidth - constrainPadding) * totalVideoDuration) /
					(constrains.right - constrainPadding);

				dispatcher('startChange', { startAt: +startAt.toFixed(4) });
			}
		}
	}
</script>

<svelte:document
	on:mousemove={handleResize}
	on:mouseup={() => {
		isTrimming = false;
		resizer = null;
		dispatcher('resizeEnd');
	}}
/>

<div
	class="w-full h-10 bg-blue-500/30 rounded-md overflow-hidden relative"
	style="width: var(--width, 100%); left: var(--left, 0)"
	bind:this={trimmerRef}
>
	<button
		class="w-auto h-full px-4 cursor-ew-resize absolute top-0 left-0"
		on:mousedown={(e) => handleResizeStart(e, 'left')}
	>
		<div class="w-1 h-1/2 bg-white/50 rounded-full" />
	</button>
	<button
		class="w-auto h-full px-4 cursor-ew-resize absolute top-0 right-0"
		on:mousedown={(e) => handleResizeStart(e, 'right')}
	>
		<div class="w-1 h-1/2 bg-white/50 rounded-full" />
	</button>
</div>
