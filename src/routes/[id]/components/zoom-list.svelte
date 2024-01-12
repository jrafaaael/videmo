<script lang="ts">
	import { recording } from '$lib/stores/recording.store';
	import { zoomList } from '../stores/zoom-list.store';
	import Zoom from './zoom.svelte';

	function handleAddZoom() {
		zoomList.addZoom({
			id: new Date().getTime(),
			start: 0,
			end: $recording?.duration
		});
	}
</script>

<svelte:document
	on:dblclick={() => {
		console.log($zoomList);
		zoomList._clear();
	}}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="w-full h-10 flex" on:click|self={handleAddZoom}>
	{#each $zoomList as zoom}
		<Zoom
			on:startChange={({ detail }) => {
				zoomList.updateZoomById({
					...zoom,
					start: detail.startAt
				});
			}}
			on:endChange={({ detail }) => {
				zoomList.updateZoomById({
					...zoom,
					end: detail.endAt
				});
			}}
		/>
	{/each}
</div>
