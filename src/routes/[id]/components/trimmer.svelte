<script lang="ts">
	import * as ContextMenu from '$lib/components/context-menu';
	import Trash from '$lib/components/icons/trash.svelte';
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import { cuts } from '../stores/cuts.store';
	import { isEditingTrim } from '../stores/is-editing-trim.store';
	import { recording } from '../stores/recording.store';
	import { videoStatus } from '../stores/video-status.store';
	import { MIN_CUT_DURATION_IN_SECONDS } from '../utils/constants';
	import Merge from './icons/merge.svelte';
	import Moveable from './moveable.svelte';

	$: currentRecordingDuration = $recording?.duration!;
</script>

{#each $cuts as cut, idx}
	{@const width = ((cut.endAt - cut.startAt) * 100) / currentRecordingDuration}
	{@const left = (cut.startAt * 100) / currentRecordingDuration}
	{@const nextCut = $cuts.at(idx + 1)}
	{@const prevCut = idx === 0 ? null : $cuts.at(idx - 1)}
	<Moveable
		className={{
			root: `group h-10 bg-white/5 border-2 border-white/10 rounded-lg absolute ring ring-transparent ring-offset-0 cursor-grab active:cursor-grabbing [&.current-trim]:bg-blue-700/20 [&.current-trim]:border-blue-700/50 [&.current-trim]:focus-within:ring-blue-700/20 hover:bg-blue-700/20 hover:border-blue-700/50 has-[:active]:bg-blue-700/20 has-[:active]:border-blue-700/50 focus-within:ring-white/5 focus-within:hover:ring-blue-700/20 focus-within:active:ring-blue-700/20 ${
				$videoStatus.currentTime >= cut.startAt && $videoStatus.currentTime <= cut.endAt
					? 'current-trim'
					: ''
			}`,
			handle:
				'h-full absolute cursor-ew-resize opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-active:opacity-100 group-active:pointer-events-auto group-[.current-trim]:opacity-100 group-[.current-trim]:pointer-events-auto group-[.current-trim]:has-[:active]:!opacity-100 group-[.current-trim]:has-[:active]:!pointer-events-auto group-has-[:active]:opacity-100 group-has-[:active]:pointer-events-auto',
			handleW: '-left-[12px]',
			handleE: 'z-10 -right-[12px]'
		}}
		{width}
		{left}
		on:resizeStart={() => ($isEditingTrim = true)}
		on:resize={({ detail }) => {
			// BUG: when resizing to end, allow to set `end` time equals to `end` of trimming
			const { direction, delta, refToElement } = detail;
			const zoomRect = refToElement.getBoundingClientRect();
			const constrains = refToElement.parentElement.getBoundingClientRect();

			if (direction === 'right') {
				const end = +(
					((zoomRect.right + delta - constrains.left) * currentRecordingDuration) /
					(constrains.right - constrains.left)
				).toFixed(2);

				if (end === cut.endAt) {
					return;
				}

				$cuts = $cuts.with(idx, {
					...cut,
					endAt: Math.max(
						Math.abs(cut.startAt + MIN_CUT_DURATION_IN_SECONDS),
						!nextCut ? end : Math.min(end, +nextCut?.startAt.toFixed(2))
					)
				});
			} else if (direction === 'left') {
				const start = +(
					((zoomRect.left - delta - constrains.left) * currentRecordingDuration) /
					(constrains.right - constrains.left)
				).toFixed(2);

				if (start === cut.startAt) {
					return;
				}

				$cuts = $cuts.with(idx, {
					...cut,
					startAt: Math.min(
						Math.abs(cut.endAt - MIN_CUT_DURATION_IN_SECONDS),
						!prevCut ? start : Math.max(start, +prevCut?.endAt.toFixed(2))
					)
				});
			}
		}}
		on:resizeEnd={() => ($isEditingTrim = false)}
		on:dragStart={() => ($isEditingTrim = true)}
		on:drag={({ detail }) => {
			const { refToElement, left } = detail;
			const constrains = refToElement.parentElement.getBoundingClientRect();
			const dif = cut.endAt - cut.startAt;
			const start = +Math.max(
				0,
				(left * currentRecordingDuration) / (constrains.right - constrains.left),
				prevCut?.endAt ?? -Infinity
			).toFixed(2);
			const end = +Math.min(
				currentRecordingDuration ?? Infinity,
				start + dif,
				nextCut?.startAt ?? Infinity
			).toFixed(2);

			$cuts = $cuts.with(idx, {
				...cut,
				startAt: +Math.min(start, end - dif).toFixed(2),
				endAt: end
			});
		}}
		on:dragEnd={() => ($isEditingTrim = false)}
		on:mouseenter={({ detail }) => {
			const { e } = detail;

			if (e.currentTarget?.classList.contains('current-trim')) return;

			const currentTrim = document.querySelector('.current-trim');
			const handles = currentTrim?.querySelectorAll('button');

			handles?.forEach((e) => e.classList.add('!opacity-0', '!pointer-events-none'));
		}}
		on:mouseleave={({ detail }) => {
			const { e } = detail;

			if (e.currentTarget?.classList.contains('current-trim')) return;

			const currentTrim = document.querySelector('.current-trim');
			const handles = currentTrim?.querySelectorAll('button');

			handles?.forEach((e) => e.classList.remove('!opacity-0', '!pointer-events-none'));
		}}
	>
		<div
			slot="w"
			class="w-[12px] h-[75%] bg-blue-900 rounded-l-md flex justify-center items-center relative"
		>
			<output
				class="py-1 px-2 bg-neutral-300 rounded-md text-neutral-800 text-xs hidden absolute top-0 left-1/2 z-20 -translate-y-9 -translate-x-1/2 tabular-nums select-none group-active:block"
			>
				{secondsToTime(cut.startAt, { showMilliseconds: true })}
			</output>
			<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
		</div>
		<div
			slot="e"
			class="w-[12px] h-[75%] bg-blue-900 rounded-r-md flex justify-center items-center relative"
		>
			<output
				class="py-1 px-2 bg-neutral-300 rounded-md text-neutral-800 text-xs hidden absolute top-0 left-1/2 z-20 -translate-y-9 -translate-x-1/2 tabular-nums select-none group-active:block"
			>
				{secondsToTime(cut.endAt, { showMilliseconds: true })}
			</output>
			<div class="w-[2px] h-[45%] bg-neutral-50/50 rounded-full" />
		</div>
		<ContextMenu.Root
			positioning={{
				placement: 'right'
			}}
		>
			<ContextMenu.Trigger class="w-full h-full absolute outline-none" />
			<ContextMenu.Menu
				class="bg-neutral-800/80 border-2 border-white/5 rounded-md flex flex-col gap-1 overflow-hidden outline-none backdrop-blur-sm z-20"
			>
				<ContextMenu.Item
					class="min-w-36 py-1 px-2 flex items-center gap-2 outline-none hover:bg-white/5 focus:bg-white/5"
					on:m-click={() => {
						if (!nextCut) return;

						const newCut = {
							...cut,
							endAt: nextCut.endAt
						};

						$cuts = [...$cuts.toSpliced(idx, 2), newCut];
					}}
				>
					<span class="w-4 aspect-square text-neutral-50/50 inline-block">
						<Merge />
					</span>
					<span class="font-normal">Merge next</span>
				</ContextMenu.Item>
				<ContextMenu.Item
					class="min-w-36 py-1 px-2 flex items-center gap-2 outline-none hover:bg-white/5 focus:bg-white/5"
					on:m-click={() => {
						if (!prevCut) return;

						const newCut = {
							...cut,
							startAt: prevCut.startAt
						};

						$cuts = [...$cuts.toSpliced(idx - 1, 2), newCut];
					}}
				>
					<span class="w-4 aspect-square text-neutral-50/50 inline-block rotate-180">
						<Merge />
					</span>
					<span class="font-normal">Merge previous</span>
				</ContextMenu.Item>
				<div class="w-full h-0.5 bg-white/5" />
				<ContextMenu.Item
					class="min-w-36 py-1 px-2 text-red-500 flex items-center gap-2 outline-none hover:bg-red-600/15 focus:bg-red-600/15"
					on:m-click={() => {
						if ($cuts.length <= 1) return;

						$cuts = $cuts.toSpliced(idx, 1);
					}}
				>
					<span class="w-4 aspect-square inline-block">
						<Trash />
					</span>
					<span class="font-normal">Remove</span>
				</ContextMenu.Item>
			</ContextMenu.Menu>
		</ContextMenu.Root>
	</Moveable>
{/each}
