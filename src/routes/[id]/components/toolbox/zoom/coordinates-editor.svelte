<script lang="ts">
	import { onMount } from 'svelte';
	import { zoomList, currentZoom } from '../../../stores/zoom-list.store';

	let draggableRef: HTMLButtonElement;
	let isDragging = false;
	let mousePositionWhenDragStart = { x: 0, y: 0 };

	function handleDragging(e: MouseEvent) {
		if (isDragging) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const constrains = draggableRef.parentElement!.getBoundingClientRect();
			const draggableSize = draggableRef.getBoundingClientRect().width / 2;
			const dx = Math.min(
				Math.max(e.clientX - mousePositionWhenDragStart.x, -draggableSize),
				constrains.width - draggableSize
			);
			const dy = Math.min(
				Math.max(e.clientY - mousePositionWhenDragStart.y, -draggableSize),
				constrains.height - draggableSize
			);
			const centerX = draggableRef.offsetLeft + draggableRef.offsetWidth / 2;
			const centerY = draggableRef.offsetTop + draggableRef.offsetHeight / 2;
			const percentX = +((centerX / constrains.width) * 100).toFixed(0);
			const percentY = +((centerY / constrains.height) * 100).toFixed(0);

			draggableRef.style.setProperty('--positionX', `${dx}px`);
			draggableRef.style.setProperty('--positionY', `${dy}px`);

			if (currentZoom) {
				zoomList.updateZoomById({ ...$currentZoom, x: percentX, y: percentY });
			}
		}
	}

	function handleDragEnd() {
		isDragging = false;
	}

	onMount(() => {
		draggableRef.style.setProperty(
			'--positionX',
			`calc(${$currentZoom?.x}% - ${draggableRef?.getBoundingClientRect().width / 2}px)`
		);
		draggableRef.style.setProperty(
			'--positionY',
			`calc(${$currentZoom?.y}% - ${draggableRef?.getBoundingClientRect().height / 2}px)`
		);

		document.addEventListener('mousemove', handleDragging);
		document.addEventListener('mouseup', handleDragEnd);

		return () => {
			document.removeEventListener('mousemove', handleDragging);
			document.removeEventListener('mouseup', handleDragEnd);
		};
	});
</script>

<!-- BUG: `mouseup` event on `svelte:document` fires `input` event on numeric input indefinitely -->
<!-- <svelte:document
	on:mousemove={handleDragging}
	on:mouseup={() => (isDragging = false)}
/> -->

<div
	class="w-full aspect-video bg-white/5 border border-white/5 rounded-md relative {isDragging ? 'cursor-grabbing' : ''}"
>
	<button
		class="w-4 aspect-square bg-white/50 rounded-full absolute inset-0 cursor-grab active:cursor-grabbing"
		style="top: var(--positionY, 0%); left: var(--positionX, 0%);"
		bind:this={draggableRef}
		on:mousedown={(e) => {
			isDragging = true;
			mousePositionWhenDragStart.x = e.clientX - draggableRef.offsetLeft;
			mousePositionWhenDragStart.y = e.clientY - draggableRef.offsetTop;
		}}
	/>
</div>
