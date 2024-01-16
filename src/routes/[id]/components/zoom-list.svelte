<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { zoomList } from '../stores/zoom-list.store';
	import Zoom from './zoom.svelte';

	function handleAddZoom() {
		zoomList.addZoom({
			id: new Date().getTime(),
			start: 0,
			end: $recording?.duration
		});
	}
</script>

<svelte:document
	on:dblclick={() => {
		console.log($zoomList);
		zoomList._clear();
	}}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="w-full h-10 relative">
	{#each $zoomList as zoom, idx (zoom.id)}
		{@const width = ((zoom.end - zoom.start) * 100) / $recording?.duration}
		{@const left = (zoom.start * 100) / $recording?.duration}
		{@const nextZoom = $zoomList.at(idx + 1)}
		{@const prevZoom = idx === 0 ? null : $zoomList.at(idx - 1)}
		<Zoom
			{width}
			{left}
			on:resize={({ detail }) => {
				const { direction, delta, refToElement } = detail;
				const zoomRect = refToElement.getBoundingClientRect();
				const constrains = refToElement.parentElement.getBoundingClientRect();

				if (direction === 'right') {
					const endAt = (
						((zoomRect.right + delta - constrains.left) * $recording.duration) /
						(constrains.right - constrains.left)
					).toFixed(2);

					if (delta < 0 || +endAt < (nextZoom?.start ?? Infinity)) {
						zoomList.updateZoomById({
							...zoom,
							end: +endAt
						});
					} else if (nextZoom && +endAt > nextZoom?.start) {
						zoomList.updateZoomById({
							...zoom,
							end: nextZoom?.start
						});
					}
				} else if (direction === 'left') {
					const startAt = (
						((zoomRect.left - delta - constrains.left) * $recording.duration) /
						(constrains.right - constrains.left)
					).toFixed(2);

					if (delta < 0 || +startAt > (prevZoom?.end ?? -Infinity)) {
						zoomList.updateZoomById({
							...zoom,
							start: +startAt
						});
					} else if (prevZoom && +startAt < prevZoom.end) {
						zoomList.updateZoomById({
							...zoom,
							start: prevZoom?.end
						});
					}
				}
			}}
		/>
	{/each}
</div>
