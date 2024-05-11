<script lang="ts">
	import { onMount } from 'svelte';
	import { videoStatus } from '../stores/video-status.store';
	import Cropper from './cropper.svelte';

	let canvasRef: HTMLCanvasElement;

	onMount(() => {
		if (!$videoStatus.ref) return;

		const ctx = canvasRef.getContext('2d');

		ctx?.drawImage(
			$videoStatus.ref,
			0,
			0,
			$videoStatus.ref.videoWidth,
			$videoStatus.ref.videoHeight
		);
	});
</script>

<div class="max-w-full rounded-md overflow-hidden relative">
	{#if $videoStatus.ref}
		<canvas
			class="max-w-full block"
			width={$videoStatus.ref.videoWidth}
			height={$videoStatus.ref.videoHeight}
			bind:this={canvasRef}
		/>
	{/if}
	{#if canvasRef}
		<Cropper img={canvasRef} on:crop />
	{/if}
</div>
