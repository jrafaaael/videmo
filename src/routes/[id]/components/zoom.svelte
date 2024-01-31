<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	type Resizer = 'right' | 'left';

	export let minWidth = 100;
	export let width = 100;
	export let left = 0;
	let isTrimming: boolean;
	let resizer: Resizer | null = null;
	let trimmerRef: HTMLDivElement;
	let mousePositionWhenResizingStart: number | null = null;
	let trimmerRectWhenResizingStart: DOMRect | null = null;
	let dispatcher = createEventDispatcher();

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

	function handleResize(e: MouseEvent) {
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

		if (resizer === 'right') {
			const delta = e.pageX - mousePositionWhenResizingStart;
			const interalWidth = Math.min(
				constrains.width,
				constrains.width - trimmerRect.left + constrains.left,
				trimmerRectWhenResizingStart.width + delta
			);

			if (interalWidth >= minWidth) {
				const deltaWidth = interalWidth - trimmerRect.width;

				if (!width) {
					const widthInPercentage = (width * 100) / constrains.width;

					trimmerRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
				}

				dispatcher('resize', {
					direction: resizer,
					delta: deltaWidth,
					refToElement: trimmerRef
				});
			}
		} else if (resizer === 'left') {
			const delta = mousePositionWhenResizingStart - e.pageX;
			const internalLeft = trimmerRectWhenResizingStart.left - delta - constrains.left;
			const internalWidth = Math.min(
				constrains.width,
				trimmerRectWhenResizingStart.width + delta,
				trimmerRectWhenResizingStart.width + internalLeft + delta
			);

			if (internalWidth >= minWidth) {
				const deltaWidth = internalWidth - trimmerRect.width;

				if (!width) {
					const widthInPercentage = (internalWidth * 100) / constrains.width;
					const leftInPercentage = Math.max(0, (internalLeft * 100) / constrains.width);

					trimmerRef.style.setProperty('width', widthInPercentage.toFixed(1) + '%');
					trimmerRef.style.setProperty('left', leftInPercentage.toFixed(1) + '%');
				}

				dispatcher('resize', {
					direction: resizer,
					delta: deltaWidth,
					refToElement: trimmerRef
				});
			}
		}
	}

	function handleResizeEnd() {
		isTrimming = false;
		resizer = null;
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
	class="h-10 bg-emerald-500/30 rounded-md overflow-hidden absolute"
	style="width: {width}%; left: {left}%"
	bind:this={trimmerRef}
	on:dblclick={(e) => dispatcher('dblclick', { e })}
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
