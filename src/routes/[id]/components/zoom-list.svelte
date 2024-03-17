<script lang="ts">
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';
	import { zooms } from '../stores/zooms.store';
	import { ZOOM_TRANSITION_DURATION } from '../utils/constants';
	import Resizable from './resizable.svelte';
</script>

<div class="w-full h-10 relative">
	{#each $zooms as zoom, idx (zoom.id)}
		{@const width = ((zoom.end - zoom.start) * 100) / $recording?.duration}
		{@const left = (zoom.start * 100) / $recording?.duration}
		{@const nextZoom = $zooms.at(idx + 1)}
		{@const prevZoom = idx === 0 ? null : $zooms.at(idx - 1)}
		<Resizable
			className={{
				root: `group h-10 bg-white/5 border-2 border-white/10 rounded-lg absolute ring ring-transparent ring-offset-0 [&.current-zoom]:bg-emerald-800/30 [&.current-zoom]:border-emerald-800/80 [&.current-zoom]:focus-within:ring-emerald-800/30 hover:bg-emerald-800/30 hover:border-emerald-800/80 has-[:active]:bg-emerald-800/30 has-[:active]:border-emerald-800/80 focus-within:ring-white/5 focus-within:hover:ring-emerald-800/30 ${
					$videoStatus.currentTime >= zoom.start && $videoStatus.currentTime <= zoom.end
						? 'current-zoom'
						: ''
				}`,
				handle:
					'h-full absolute cursor-ew-resize hidden z-10 group-hover:block group-active:visible group-[.current-zoom]:block group-has-[:active]:block',
				handleW: '-left-[12px]',
				handleE: '-right-[12px]'
			}}
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
					if (end - zoom.start < ZOOM_TRANSITION_DURATION * 2) {
						zooms.updateZoomById({
							...zoom,
							end: zoom.start + ZOOM_TRANSITION_DURATION * 2
						});
					} else if (!nextZoom || end < nextZoom.start) {
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
					if (zoom.end - start < ZOOM_TRANSITION_DURATION * 2) {
						zooms.updateZoomById({
							...zoom,
							start: zoom.end - ZOOM_TRANSITION_DURATION * 2
						});
					} else if (!prevZoom || start > prevZoom.end) {
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
			on:mouseenter={({ detail }) => {
				const { e } = detail;

				if (e.currentTarget?.classList.contains('current-zoom')) return;

				const currentZoom = document.querySelector('.current-zoom');
				const handles = currentZoom?.querySelectorAll('button');

				handles?.forEach((e) => e.classList.add('invisible'));
			}}
			on:mouseleave={({ detail }) => {
				const { e } = detail;

				if (e.currentTarget?.classList.contains('current-zoom')) return;

				const currentZoom = document.querySelector('.current-zoom');
				const handles = currentZoom?.querySelectorAll('button');

				handles?.forEach((e) => e.classList.remove('invisible'));
			}}
		>
			<div
				slot="w"
				class="w-[12px] h-[75%] bg-emerald-900 rounded-l-md flex justify-center items-center"
			>
				<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
			</div>
			<div
				slot="e"
				class="w-[12px] h-[75%] bg-emerald-900 rounded-r-md flex justify-center items-center"
			>
				<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
			</div>
		</Resizable>
	{/each}
</div>
