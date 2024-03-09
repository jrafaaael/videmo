<!-- <script lang="ts">
	import { edits } from '../stores/edits.store';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';
	import Resizable from './resizable.svelte';

	export let isResizing: boolean;
	$: width = (($edits.endAt - $edits.startAt) * 100) / $recording?.duration;
	$: left = ($edits.startAt * 100) / $recording?.duration;
</script>

<Resizable
	className="h-10 bg-blue-500/30 rounded-md overflow-hidden"
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

			$edits.startAt = start;

			if ($edits.startAt >= $videoStatus.currentTime) {
				$videoStatus.currentTime = start;
			}
		} else if (direction === 'right') {
			const end = +(
				((zoomRect.right + delta - constrains.left) * $recording.duration) /
				(constrains.right - constrains.left)
			).toFixed(2);

			$edits.endAt = end;

			if ($edits.endAt <= $videoStatus.currentTime) {
				$videoStatus.currentTime = end;
			}
		}
	}}
/> -->

<script lang="ts">
	import Moveable from 'svelte-moveable';
	// import { edits } from '../stores/edits.store';
	// import { recording } from '../stores/recording.store';
	// import { videoStatus } from '../stores/video-status.store';

	export let isResizing: boolean;
	let target: HTMLDivElement;
	// $: width = (($edits.endAt - $edits.startAt) * 100) / $recording?.duration;
	// $: left = ($edits.startAt * 100) / $recording?.duration;
</script>

<div class="h-10 bg-blue-500/30 rounded-md overflow-hidden" bind:this={target} />
<Moveable
	className="[&>*.moveable-line]:hidden"
	{target}
	hideDefaultLines
	origin={false}
	snappable
	bounds={{ position: 'css', left: 0, top: 0, right: 0, bottom: 0 }}
	resizable
	useResizeObserver
	throttleResize={0}
	renderDirections={['e', 'w']}
	on:resize={({ detail: e }) => {
		const bounds = e.target.parentElement?.getBoundingClientRect();
		const width = Number(((e.width * 100) / bounds?.width).toFixed(2));

		e.target.style.width = `${width}%`;
		e.target.style.transform = e.drag.transform;
	}}
/>

<style lang="postcss">
	:global(.moveable-control) {
		@apply w-8 h-10 -mt-5 bg-transparent border-none flex justify-center items-center !important;
	}

	:global(.moveable-control.moveable-e) {
		@apply -ml-8 !important;
	}

	:global(.moveable-control.moveable-w) {
		@apply ml-0 !important;
	}

	:global(.moveable-control::after) {
		@apply w-1 h-5 bg-white/50 rounded-full block;
		content: '';
	}
</style>
