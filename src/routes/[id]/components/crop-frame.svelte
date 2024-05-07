<script lang="ts">
	import { onMount } from 'svelte';
	import { videoStatus } from '../stores/video-status.store';
	import Cropper from './cropper.svelte';

	let canvasRef: HTMLCanvasElement;

	onMount(() => {
		if (!$videoStatus.ref) return;

		const ctx = canvasRef.getContext('2d');

		ctx?.drawImage($videoStatus.ref, 0, 0, 1920, 1080);
	});
</script>

<div class="max-w-full rounded-md overflow-hidden relative">
	<canvas class="max-w-full block" width="1920" height="1080" bind:this={canvasRef} />
	{#if canvasRef}
		<Cropper img={canvasRef} />
	{/if}
</div>
