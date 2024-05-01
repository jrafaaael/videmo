<script lang="ts">
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import { edits } from '../stores/edits.store';
	import { isEditingTrim } from '../stores/is-editing-trim.store';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';
	import Moveable from './moveable.svelte';

	const MIN_VIDEO_DURATION_IN_SECONDS = 1;
	$: currentRecordingDuration = $recording?.duration ?? 0;
	$: width = (($edits.endAt - $edits.startAt) * 100) / currentRecordingDuration;
	$: left = ($edits.startAt * 100) / currentRecordingDuration;
</script>

<Moveable
	className={{
		root: `group h-10 bg-white/5 border-2 border-white/10 rounded-lg absolute ring ring-transparent ring-offset-0 cursor-grab active:cursor-grabbing [&.current-trim]:bg-blue-700/20 [&.current-trim]:border-blue-700/50 [&.current-trim]:focus-within:ring-blue-700/20 hover:bg-blue-700/20 hover:border-blue-700/50 has-[:active]:bg-blue-700/20 has-[:active]:border-blue-700/50 focus-within:ring-white/5 focus-within:hover:ring-blue-700/20 ${
			$videoStatus.currentTime >= $edits.startAt && $videoStatus.currentTime <= $edits.endAt
				? 'current-trim'
				: ''
		}`,
		handle:
			'h-full absolute cursor-ew-resize hidden group-hover:block group-[.current-trim]:block group-has-[:active]:block',
		handleW: 'group/w -left-[12px]',
		handleE: 'group/e -right-[12px]'
	}}
	{width}
	{left}
	on:resizeStart={() => ($isEditingTrim = true)}
	on:resize={({ detail }) => {
		const { direction, delta, refToElement } = detail;
		const zoomRect = refToElement.getBoundingClientRect();
		const constrains = refToElement.parentElement.getBoundingClientRect();

		if (direction === 'left') {
			const start = +(
				((zoomRect.left - delta - constrains.left) * currentRecordingDuration) /
				(constrains.right - constrains.left)
			).toFixed(2);

			$edits.startAt = Math.min(start, Math.abs($edits.endAt - MIN_VIDEO_DURATION_IN_SECONDS));
		} else if (direction === 'right') {
			const end = +(
				((zoomRect.right + delta - constrains.left) * currentRecordingDuration) /
				(constrains.right - constrains.left)
			).toFixed(2);

			$edits.endAt = Math.max(end, Math.abs($edits.startAt + MIN_VIDEO_DURATION_IN_SECONDS));
		}
	}}
	on:resizeEnd={() => ($isEditingTrim = false)}
	on:dragStart={() => ($isEditingTrim = true)}
	on:drag={({ detail }) => {
		const { refToElement, left } = detail;
		const constrains = refToElement.parentElement.getBoundingClientRect();
		const dif = $edits.endAt - $edits.startAt;
		const start = +Math.max(
			0,
			(left * currentRecordingDuration) / (constrains.right - constrains.left)
		).toFixed(2);
		const end = +Math.min(currentRecordingDuration ?? Infinity, start + dif).toFixed(2);

		$edits.startAt = Math.min(start, end - dif);
		$edits.endAt = end;
	}}
	on:dragEnd={() => ($isEditingTrim = false)}
>
	<div
		slot="w"
		class="w-[12px] h-[75%] bg-blue-900 rounded-l-md flex justify-center items-center relative"
	>
		<output
			class="py-1 px-2 bg-neutral-300 rounded-md text-neutral-800 text-xs hidden absolute top-0 left-1/2 z-20 -translate-y-8 -translate-x-1/2 tabular-nums group-active/w:block"
		>
			{secondsToTime($edits.startAt, { showMilliseconds: true })}
		</output>
		<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
	</div>
	<div
		slot="e"
		class="w-[12px] h-[75%] bg-blue-900 rounded-r-md flex justify-center items-center relative"
	>
		<output
			class="py-1 px-2 bg-neutral-300 rounded-md text-neutral-800 text-xs hidden absolute top-0 left-1/2 z-20 -translate-y-8 -translate-x-1/2 tabular-nums group-active/e:block"
		>
			{secondsToTime($edits.endAt, { showMilliseconds: true })}
		</output>
		<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
	</div>
</Moveable>
