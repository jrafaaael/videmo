<script lang="ts">
	import { edits } from '../stores/edits.store';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';
	import Resizable from './resizable.svelte';

	export let isResizing: boolean;
	const MIN_VIDEO_DURATION_IN_SECONDS = 1;
	$: width = (($edits.endAt - $edits.startAt) * 100) / $recording?.duration;
	$: left = ($edits.startAt * 100) / $recording?.duration;
</script>

<Resizable
	className={{
		root: `group h-10 bg-white/5 border-2 border-white/10 rounded-lg absolute ring ring-transparent ring-offset-0 [&.current-trim]:bg-blue-700/20 [&.current-trim]:border-blue-700/50 [&.current-trim]:focus-within:ring-blue-700/30 hover:bg-blue-700/20 hover:border-blue-700/50 has-[:active]:bg-blue-700/20 has-[:active]:border-blue-700/50 focus-within:ring-white/5 focus-within:hover:ring-blue-700/30 *:hover:z-10 ${
			$videoStatus.currentTime >= $edits.startAt && $videoStatus.currentTime <= $edits.endAt
				? 'current-trim'
				: ''
		}`,
		handle: 'h-full absolute cursor-ew-resize',
		handleW: '-left-[12px]',
		handleE: '-right-[12px]'
	}}
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
	<div
		slot="w"
		class="w-[12px] h-[75%] bg-blue-900 rounded-l-md flex justify-center items-center invisible group-hover:visible group-[.current-trim]:visible group-has-[:active]:visible"
	>
		<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
	</div>
	<div
		slot="e"
		class="w-[12px] h-[75%] bg-blue-900 rounded-r-md flex justify-center items-center invisible group-hover:visible group-[.current-trim]:visible group-has-[:active]:visible"
	>
		<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
	</div>
</Resizable>
