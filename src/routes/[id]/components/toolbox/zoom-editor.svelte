<script>
	import { videoStatus } from '../../stores/video-status.store';
	import { zoomList } from '../../stores/zoom-list.store';

	function handleAddZoom() {
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

<div class="relative rounded-md overflow-hidden">
	<button
		class="w-full h-full p-2 bg-black/50 flex justify-center items-center absolute inset-0"
		on:click={handleAddZoom}
	>
		➕ Add zoom
	</button>
	<div class="w-full aspect-video bg-white/5" />
</div>
