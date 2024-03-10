<script lang="ts">
	import Moveable from 'svelte-moveable';
	import { recording } from '../stores/recording.store';
	import type { Zoom } from '../stores/zooms.store';

	export let zoom: Zoom;
	let target: HTMLDivElement;
	let moveableRef: Moveable;
	let isFirstRender = true;

	$: if (moveableRef && target.parentElement && $recording) {
		const bounds = target.parentElement?.getBoundingClientRect();
		const width = ((zoom.end - zoom.start) * bounds?.width) / $recording?.duration;
		const left = (zoom.start * bounds?.width) / $recording?.duration;

		if (isFirstRender) {
			target.classList.remove('invisible');

			// I don't know why I need to do this way instead of `request` (as trimmer) but it's the only way I found to make it work
			target.style.width = `${width}px`;
			target.style.transform = `translate3d(${left}px, 0, 0)`;

			isFirstRender = false;
		}
	}
</script>

<div
	class="h-full bg-emerald-500/30 rounded-lg overflow-hidden absolute invisible"
	bind:this={target}
/>
<Moveable
	className="zoom-control-box {isFirstRender ? '!invisible ' : ''}"
	{target}
	hideDefaultLines
	origin={false}
	snappable
	bounds={{ position: 'css', left: 0, top: 0, right: 0, bottom: 0 }}
	resizable
	useResizeObserver
	throttleResize={0}
	renderDirections={['e', 'w']}
	draggable={isFirstRender}
	bind:this={moveableRef}
	on:drag={({ detail: e }) => {
		e.target.style.transform = e.transform;
	}}
	on:resize={({ detail: e }) => {
		const bounds = e.target.parentElement?.getBoundingClientRect();
		const zoomRect = e.target.getBoundingClientRect();
		const [deltaX] = e.delta;
		const direction = e.direction.at(0) === 1 ? 'right' : 'left';

		if (!bounds) return;
		if (!$recording) return;

		const width = Number(((e.width * 100) / bounds?.width).toFixed(2));

		e.target.style.width = `${width}%`;
		// TODO: try to use percentage instead of resize observer
		e.target.style.transform = e.drag.transform;

		if (isFirstRender) return;

		if (direction === 'left') {
			const start = +(
				((zoomRect.left - deltaX - bounds.left) * $recording.duration) /
				(bounds.right - bounds.left)
			).toFixed(2);

			console.log(start);
		} else if (direction === 'right') {
			const end = +(
				((zoomRect.right + deltaX - bounds.left) * $recording.duration) /
				(bounds.right - bounds.left)
			).toFixed(2);
		}
	}}
/>

<style lang="postcss">
	:global(.zoom-control-box) {
		& .moveable-line {
			@apply hidden invisible !important;
		}

		& .moveable-control {
			@apply w-8 h-10 -mt-5 bg-transparent border-none flex justify-center items-center !important;
		}

		& .moveable-control.moveable-e {
			@apply -ml-8 !important;
		}

		& .moveable-control.moveable-w {
			@apply ml-0 !important;
		}

		& .moveable-control::after {
			@apply w-1 h-5 bg-white/50 rounded-full block;
			content: '';
		}
	}
</style>
