<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.min.css';

	export let img: HTMLImageElement | HTMLCanvasElement;
	const dispatch = createEventDispatcher();
	let cropper: Cropper | null = null;

	onMount(() => {
		cropper = new Cropper(img as HTMLImageElement, {
			dragMode: 'none',
			viewMode: 2,
			autoCropArea: 1,
			background: false,
			movable: false,
			rotatable: false,
			scalable: false,
			zoomable: false,
			crop(event) {
				const { detail } = event;

				dispatch('crop', { ...detail });
			}
		});
	});
</script>
