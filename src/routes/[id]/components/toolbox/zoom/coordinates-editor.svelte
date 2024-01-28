<script lang="ts">
	import { onMount } from 'svelte';
	import { currentZoomIndex, zoomList } from '../../../stores/zoom-list.store';

	let dragableRef: HTMLButtonElement;
	let isDragging = false;

	function handleDragging(e: MouseEvent) {
		if (isDragging) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const constrains = dragableRef.parentElement!.getBoundingClientRect();
			const x = Math.min(Math.max(e.clientX - constrains.left, 0), constrains.width);
			const y = Math.min(Math.max(e.clientY - constrains.top, 0), constrains.height);
			const xInPercentage = +((x * 100) / constrains.width).toFixed(0);
			const yInPercentage = +((y * 100) / constrains.height).toFixed(0);

			dragableRef.style.setProperty('--positionX', `${xInPercentage}%`);
			dragableRef.style.setProperty('--positionY', `${yInPercentage}%`);

			const currentZoom = $zoomList.at($currentZoomIndex);

			if (currentZoom) {
				zoomList.updateZoomById({ ...currentZoom, x: xInPercentage, y: yInPercentage });
			}
		}
	}

	function handleDragEnd() {
		isDragging = false;
	}

	onMount(() => {
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

<div class="w-full aspect-video bg-white/5 relative {isDragging ? 'cursor-grabbing' : ''}">
	<button
		class="w-4 aspect-square bg-white/50 rounded-full absolute inset-0 cursor-grab active:cursor-grabbing"
		style="top: var(--positionY, 0%); left: var(--positionX, 0%);"
		bind:this={dragableRef}
		on:mousedown={() => (isDragging = true)}
	/>
</div>
