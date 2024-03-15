<script lang="ts">
	import { edits } from '../stores/edits.store';
	import { recording } from '../stores/recording.store';
	import Resizable from './resizable.svelte';

	export let isResizing: boolean;
	const MIN_VIDEO_DURATION_IN_SECONDS = 1;
	$: width = (($edits.endAt - $edits.startAt) * 100) / $recording?.duration;
	$: left = ($edits.startAt * 100) / $recording?.duration;
</script>

<Resizable
	className={{ root: 'h-10 bg-blue-500/30 rounded-md overflow-hidden' }}
	{width}
	{left}
	bind:isResizing
	on:resize={({ detail }) => {
		const { direction, delta, refToElement } = detail;
		const zoomRect = refToElement.getBoundingClientRect();
		const constrains = refToElement.parentElement.getBoundingClientRect();

		if (direction === 'left') {
			const start = +(
				((zoomRect.left - delta - constrains.left) * $recording.duration) /
				(constrains.right - constrains.left)
			).toFixed(2);

			$edits.startAt = Math.min(start, Math.abs($edits.endAt - MIN_VIDEO_DURATION_IN_SECONDS));
		} else if (direction === 'right') {
			const end = +(
				((zoomRect.right + delta - constrains.left) * $recording.duration) /
				(constrains.right - constrains.left)
			).toFixed(2);

			$edits.endAt = Math.max(end, Math.abs($edits.startAt + MIN_VIDEO_DURATION_IN_SECONDS));
		}
	}}
>
	<div slot="w" class="w-8 h-full flex justify-center items-center">
		<div class="w-1 h-1/2 bg-white/50 rounded-full" />
	</div>
	<div slot="e" class="w-8 h-full flex justify-center items-center">
		<div class="w-1 h-1/2 bg-white/50 rounded-full" />
	</div>
</Resizable>
