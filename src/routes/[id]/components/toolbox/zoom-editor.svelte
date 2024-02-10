<script>
	import { edits } from '$lib/stores/edits.store';
	import { videoStatus } from '../../stores/video-status.store';
	import { zooms, currentZoom } from '../../stores/zooms.store';
	import Trash from '../icons/trash.svelte';
	import CoordinatesEditor from './zoom/coordinates-editor.svelte';

	function handleAddZoom() {
		if (
			$zooms.some(
				(zoom) =>
					($videoStatus.currentTime >= zoom.start || $videoStatus.currentTime + 1 >= zoom.start) &&
					$videoStatus.currentTime <= zoom.end
			) ||
			$videoStatus.currentTime + 1 >= $edits.endAt
		) {
			return;
		}

		const currentTime = +$videoStatus.currentTime.toFixed(2);

		zooms.addZoom({
			id: new Date().getTime(),
			start: currentTime,
			end: currentTime + 1,
			x: 0,
			y: 0
		});
	}
</script>

{#if $videoStatus.currentTime >= $currentZoom?.start && $videoStatus.currentTime <= $currentZoom.end}
	<ul class="flex flex-col gap-8">
		<li class="flex flex-col gap-2">
			<p class="mb-2 text-neutral-300">Focus point</p>
			<CoordinatesEditor />
		</li>
		<li class="flex gap-2">
			<button
				class="py-[6px] px-3 bg-white/5 border border-white/5 rounded-md text-neutral-50 flex-1 flex justify-center items-center gap-2 hover:bg-white/10 hover:border-white/10"
				on:click={() => zooms.removeZoomById($currentZoom)}
			>
				<span class="w-4 aspect-square inline-block">
					<Trash />
				</span>
				<span>Remove zoom</span>
			</button>
		</li>
	</ul>
{:else}
	<button
		class="w-full aspect-video p-2 bg-white/5 border border-white/5 rounded-md flex justify-center items-center"
		on:click={handleAddZoom}
	>
		➕ Add zoom
	</button>
{/if}
