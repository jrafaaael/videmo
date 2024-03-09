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
	{target}
	origin
	resizable
	throttleResize={0}
	renderDirections={['e', 'w']}
	on:resizeStart={({ detail }) => console.log(detail)}
	on:resize={({ detail: e }) => {
		const constrains = e.target.parentElement.getBoundingClientRect();
		const trimmerRect = e.target.getBoundingClientRect();
		console.log(e);

		if (trimmerRect.left < constrains?.left) {
			return;
		}

		e.target.style.width = `${e.width}px`;
		e.target.style.transform = e.drag.transform;
	}}
/>
