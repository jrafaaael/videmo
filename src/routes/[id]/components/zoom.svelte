<script lang="ts">
	import Moveable from 'svelte-moveable';
	import { recording } from '../stores/recording.store';

	let target: HTMLDivElement;
</script>

<div
	class="min-w-24 h-full bg-emerald-500/30 rounded-lg overflow-hidden absolute"
	bind:this={target}
/>
<Moveable
	className="zoom-control-box"
	{target}
	hideDefaultLines
	origin={false}
	resizable
	useResizeObserver
	throttleResize={0}
	renderDirections={['e', 'w']}
	on:resize={({ detail: e }) => {
		const bounds = e.target.parentElement?.getBoundingClientRect();
		const zoomRect = e.target.getBoundingClientRect();
		const [deltaX] = e.delta;
		const direction = e.direction.at(0) === 1 ? 'right' : 'left';

		if (!bounds) return;
		if (!$recording) return;

		const width = Number(((e.width * 100) / bounds?.width).toFixed(2));

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

		e.target.style.width = `${width}%`;
		e.target.style.transform = e.drag.transform;
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
