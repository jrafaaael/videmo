<script>
	import { edits } from '$lib/stores/edits.store';
	import { videoStatus } from '../../stores/video-status.store';
	import { zoomList, currentZoomIndex } from '../../stores/zoom-list.store';
	import CoordinatesEditor from './zoom/coordinates-editor.svelte';

	$: currentZoom = $zoomList.at($currentZoomIndex) ?? null;

	function handleAddZoom() {
		if (
			$zoomList.some(
				(zoom) =>
					($videoStatus.currentTime >= zoom.start || $videoStatus.currentTime + 1 >= zoom.start) &&
					$videoStatus.currentTime <= zoom.end
			) ||
			$videoStatus.currentTime + 1 >= $edits.endAt
		) {
			return;
		}

		zoomList.addZoom({
			id: new Date().getTime(),
			start: $videoStatus.currentTime,
			end: $videoStatus.currentTime + 1,
			x: 0,
			y: 0
		});
	}
</script>

<svelte:document
	on:dblclick={() => {
		zoomList._clear();
	}}
/>

{#if currentZoom && currentZoom?.start <= $videoStatus.currentTime && currentZoom.end >= $videoStatus.currentTime}
	<ul class="flex flex-col gap-8">
		<li class="flex flex-col gap-2">
			<p class="text-neutral-300">Focus point</p>
			<CoordinatesEditor />
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
