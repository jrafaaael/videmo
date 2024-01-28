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

		const zoom = {
			id: new Date().getTime(),
			start: $videoStatus.currentTime,
			end: $videoStatus.currentTime + 1,
			x: 0,
			y: 0
		};

		zoomList.addZoom(zoom);
	}
</script>

<svelte:document
	on:dblclick={() => {
		zoomList._clear();
	}}
/>

<div class=" w-full rounded-md">
	{#if currentZoom && currentZoom?.start <= $videoStatus.currentTime && currentZoom.end >= $videoStatus.currentTime}
		<div class="w-full">
			<CoordinatesEditor />
		</div>
	{:else}
		<button
			class="w-full aspect-video p-2 bg-black/50 flex justify-center items-center"
			on:click={handleAddZoom}
		>
			➕ Add zoom
		</button>
	{/if}
</div>
