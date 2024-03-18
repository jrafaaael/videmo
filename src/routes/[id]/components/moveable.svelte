<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	type Direction = 'right' | 'left';

	export let width: number | null = null;
	export let left: number | null = null;
	export let className: { root?: string; handle?: string; handleE?: string; handleW?: string };
	export let isResizing: boolean | null = null;
	let isDragging = false;
	let direction: Direction | null = null;
	let moveableRef: HTMLDivElement;
	let mousePositionWhenResizingStart: number | null = null;
	let trimmerRectWhenResizingStart: DOMRect | null = null;
	let dispatcher = createEventDispatcher();

	function handleResizeStart(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		dir: Direction
	) {
		trimmerRectWhenResizingStart = moveableRef.getBoundingClientRect();
		mousePositionWhenResizingStart = e.pageX;
		isResizing = true;
		direction = dir;
		dispatcher('resizeStart');
	}

	function handleResize(e: MouseEvent) {
		if (
			!isResizing ||
			!direction ||
			!trimmerRectWhenResizingStart ||
			!mousePositionWhenResizingStart
		) {
			return;
		}

		const trimmerRect = moveableRef.getBoundingClientRect();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const constrains = moveableRef.parentElement!.getBoundingClientRect();

		if (direction === 'right') {
			const delta = e.pageX - mousePositionWhenResizingStart;
			const interalWidth = Math.min(
				constrains.width,
				constrains.width - trimmerRect.left + constrains.left,
				trimmerRectWhenResizingStart.width + delta
			);

			const deltaWidth = interalWidth - trimmerRect.width;

			if (!width) {
				const widthInPercentage = (interalWidth * 100) / constrains.width;

				moveableRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
			}

			dispatcher('resize', {
				direction,
				delta: deltaWidth,
				refToElement: moveableRef
			});
		} else if (direction === 'left') {
			const delta = mousePositionWhenResizingStart - e.pageX;
			const internalLeft = trimmerRectWhenResizingStart.left - delta - constrains.left;
			const internalWidth = Math.min(
				constrains.width,
				trimmerRectWhenResizingStart.width + delta,
				trimmerRectWhenResizingStart.width + internalLeft + delta
			);

			const deltaWidth = internalWidth - trimmerRect.width;

			if (!width) {
				const widthInPercentage = (internalWidth * 100) / constrains.width;
				const leftInPercentage = Math.max(0, (internalLeft * 100) / constrains.width);

				moveableRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
				moveableRef.style.setProperty('left', leftInPercentage.toFixed(1) + '%');
			}

			dispatcher('resize', {
				direction,
				delta: deltaWidth,
				refToElement: moveableRef
			});
		}
	}

	function handleDragStart(e: MouseEvent) {
		isDragging = true;
		mousePositionWhenResizingStart = e.pageX;
		dispatcher('dragStart');
	}

	function handleDrag(e: MouseEvent) {
		if (isDragging) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const constrains = moveableRef.parentElement!.getBoundingClientRect();
			const positionInPx = Math.min(Math.max(e.clientX - constrains.left, 0), constrains.width);
			const positionInPercentage = (positionInPx * 100) / constrains.width;

			moveableRef.style.setProperty('left', positionInPercentage.toFixed(1) + '%');
		}
	}

	function handleEvents(e: MouseEvent) {
		if (isResizing) {
			handleResize(e);
		} else if (isDragging) {
			handleDrag(e);
		}
	}

	function handleEnd() {
		isResizing = false;
		isDragging = false;
		direction = null;
		dispatcher('resizeEnd');
		dispatcher('dragEnd');
	}

	onMount(() => {
		document.addEventListener('mousemove', handleEvents);
		document.addEventListener('mouseup', handleEnd);

		return () => {
			document.removeEventListener('mousemove', handleEvents);
			document.removeEventListener('mouseup', handleEnd);
		};
	});
</script>

<!-- BUG: `mouseup` event on `svelte:document` fires `input` event on numeric input indefinitely -->
<!-- <svelte:document
	on:mousemove={handleResize}
	on:mouseup={() => {
		isTrimming = false;
		resizer = null;
		dispatcher('resizeEnd');
	}}
/> -->

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={className.root}
	style="width: {width ?? 100}%; left: {left ?? 0}%;"
	bind:this={moveableRef}
	on:mousedown={handleDragStart}
	on:mouseenter={(e) => dispatcher('mouseenter', { e })}
	on:mouseleave={(e) => dispatcher('mouseleave', { e })}
>
	<div class="w-full h-full relative">
		<button
			class="{className.handle ??
				'min-w-5 h-full cursor-ew-resize absolute top-0 left-0'} {className.handleW ?? ''}"
			on:mousedown|stopPropagation={(e) => handleResizeStart(e, 'left')}
		>
			<slot name="w" />
		</button>
		<button
			class="{className.handle ??
				'min-w-5 h-full cursor-ew-resize absolute top-0 right-0'} {className.handleE ?? ''}"
			on:mousedown|stopPropagation={(e) => handleResizeStart(e, 'right')}
		>
			<slot name="e" />
		</button>
	</div>
</div>
