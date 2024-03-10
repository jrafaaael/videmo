<script lang="ts">
	import Moveable from 'svelte-moveable';
	import { edits } from '../stores/edits.store';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';

	export let isResizing: boolean;
	let target: HTMLDivElement;
	let moveableRef: Moveable;
	let isFirstRender = true;

	$: if (moveableRef && target.parentElement && $recording) {
		const bounds = target.parentElement?.getBoundingClientRect();
		const width = (($edits.endAt - $edits.startAt) * bounds?.width) / $recording?.duration;
		const left = ($edits.startAt * bounds?.width) / $recording?.duration;

		if (isFirstRender) {
			target.classList.remove('invisible');

			moveableRef.request(
				'resizable',
				{
					offsetWidth: width
				},
				true
			);
			moveableRef.request('draggable', { x: left }, true);

			isFirstRender = false;
		}
	}
</script>

<div
	class="min-w-24 h-full bg-blue-500/30 rounded-lg overflow-hidden invisible"
	bind:this={target}
/>
<Moveable
	className="trimmer-control-box {isFirstRender ? '!invisible ' : ''}"
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
	on:resizeStart={() => (isResizing = true)}
	on:resize={({ detail: e }) => {
		const bounds = e.target.parentElement?.getBoundingClientRect();
		const trimRect = e.target.getBoundingClientRect();
		const [deltaX] = e.delta;
		const direction = e.direction.at(0) === 1 ? 'right' : 'left';

		if (!bounds) return;
		if (!$recording?.duration) return;

		const width = Number(((e.width * 100) / bounds?.width).toFixed(2));

		e.target.style.width = `${width}%`;
		// TODO: try to use percentage instead of resize observer
		e.target.style.transform = e.drag.transform;

		if (isFirstRender) return;

		if (direction === 'left') {
			const start = +(
				((trimRect.left - deltaX - bounds?.left) * $recording?.duration) /
				(bounds?.right - bounds?.left)
			).toFixed(2);

			$edits.startAt = start;

			if (start >= $videoStatus.currentTime) {
				$videoStatus.currentTime = start;
			}
		} else if (direction === 'right') {
			const end = +(
				((trimRect.right + deltaX - bounds?.left) * $recording?.duration) /
				(bounds?.right - bounds?.left)
			).toFixed(2);

			$edits.endAt = end;

			if (end <= $videoStatus.currentTime) {
				$videoStatus.currentTime = end;
			}
		}
	}}
	on:resizeEnd={() => (isResizing = true)}
/>

<style lang="postcss">
	:global(.trimmer-control-box) {
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
