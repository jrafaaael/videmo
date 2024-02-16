<script lang="ts">
	import { recording } from '../stores/recording.store';
	import { zooms } from '../stores/zooms.store';
	import Zoom from './zoom.svelte';
</script>

<div class="w-full h-10 relative">
	{#each $zooms as zoom, idx (zoom.id)}
		{@const width = ((zoom.end - zoom.start) * 100) / $recording?.duration}
		{@const left = (zoom.start * 100) / $recording?.duration}
		{@const nextZoom = $zooms.at(idx + 1)}
		{@const prevZoom = idx === 0 ? null : $zooms.at(idx - 1)}
		<Zoom
			{width}
			{left}
			on:resize={({ detail }) => {
				// BUG: when resizing to end, allow to set `end` time equals to `end` of trimming
				const { direction, delta, refToElement } = detail;
				const zoomRect = refToElement.getBoundingClientRect();
				const constrains = refToElement.parentElement.getBoundingClientRect();

				if (direction === 'right') {
					const end = +(
						((zoomRect.right + delta - constrains.left) * $recording.duration) /
						(constrains.right - constrains.left)
					).toFixed(2);

					if (end === zoom.end) {
						return;
					}

					/*
					 * `resize` event aren't fired on every size change. when `endAt` is calculated, it can has a value greater than `nextZoom.start`
					 * so current edited zoom couldn't be set to end exactly when next one starts. when this happens, I set the `end` value of
					 * the current edited zoom equals to `start` of next one
					 */
					if (!nextZoom || end < nextZoom.start) {
						zooms.updateZoomById({
							...zoom,
							end
						});
					} else if (end > nextZoom?.start) {
						zooms.updateZoomById({
							...zoom,
							end: +nextZoom?.start.toFixed(2)
						});
					}
				} else if (direction === 'left') {
					const start = +(
						((zoomRect.left - delta - constrains.left) * $recording.duration) /
						(constrains.right - constrains.left)
					).toFixed(2);

					if (start === zoom.start) {
						return;
					}

					/*
					 * `resize` event aren't fired on every size change. when `startAt` is calculated, it can has a value less than `prevZoom.end`
					 * so current edited zoom couldn't be set to start exactly when previous one ends. when this happens, I set the `start` value of
					 * the current edited zoom equals to `end` of previous one
					 */
					if (!prevZoom || start > prevZoom.end) {
						zooms.updateZoomById({
							...zoom,
							start
						});
					} else if (start < prevZoom.end) {
						zooms.updateZoomById({
							...zoom,
							start: +prevZoom?.end.toFixed(2)
						});
					}
				}
			}}
		/>
	{/each}
</div>
