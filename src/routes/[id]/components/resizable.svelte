<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	type Direction = 'right' | 'left';

	export let width: number | null = null;
	export let left: number | null = null;
	export let className: { root?: string; handle?: string };
	export let isResizing: boolean | null = null;
	let direction: Direction | null = null;
	let resizableRef: HTMLDivElement;
	let mousePositionWhenResizingStart: number | null = null;
	let trimmerRectWhenResizingStart: DOMRect | null = null;
	let dispatcher = createEventDispatcher();

	function handleResizeStart(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		dir: Direction
	) {
		trimmerRectWhenResizingStart = resizableRef.getBoundingClientRect();
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

		const trimmerRect = resizableRef.getBoundingClientRect();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const constrains = resizableRef.parentElement!.getBoundingClientRect();

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

				resizableRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
			}

			dispatcher('resize', {
				direction,
				delta: deltaWidth,
				refToElement: resizableRef
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

				resizableRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
				resizableRef.style.setProperty('left', leftInPercentage.toFixed(1) + '%');
			}

			dispatcher('resize', {
				direction,
				delta: deltaWidth,
				refToElement: resizableRef
			});
		}
	}

	function handleResizeEnd() {
		isResizing = false;
		direction = null;
		dispatcher('resizeEnd');
	}

	onMount(() => {
		document.addEventListener('mousemove', handleResize);
		document.addEventListener('mouseup', handleResizeEnd);

		return () => {
			document.removeEventListener('mousemove', handleResize);
			document.removeEventListener('mouseup', handleResizeEnd);
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

<div
	class={className.root}
	style="width: {width ?? 100}%; left: {left ?? 0}%; position: absolute;"
	bind:this={resizableRef}
>
	<div class="w-full h-full relative">
		<button
			class={className.handle ?? 'min-w-5 h-full cursor-ew-resize absolute top-0 left-0'}
			on:mousedown={(e) => handleResizeStart(e, 'left')}
		>
			<slot name="w" />
		</button>
		<button
			class={className.handle ?? 'min-w-5 h-full cursor-ew-resize absolute top-0 right-0'}
			on:mousedown={(e) => handleResizeStart(e, 'right')}
		>
			<slot name="e" />
		</button>
	</div>
</div>
