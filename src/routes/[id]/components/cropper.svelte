<script lang="ts">
	import { onMount } from 'svelte';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.min.css';

	export let img: HTMLImageElement | HTMLCanvasElement;
	let cropper = null;

	onMount(() => {
		cropper = new Cropper(img as HTMLImageElement, {
			dragMode: 'none',
			background: false,
			movable: false,
			rotatable: false,
			scalable: false,
			zoomable: false,
			crop(event) {
				console.log(event);
			}
		});
	});
</script>
