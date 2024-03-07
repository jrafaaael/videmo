<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let openPickerOnClick = true;
	export let accept: string | null = null;
	let inputRef: HTMLInputElement;
	let dispatch = createEventDispatcher();

	function handleDrop(
		e: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) {
		const dt = e.dataTransfer;
		const files = dt?.files;

		dispatch('drop', { files });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="-1"
	class={$$restProps.class}
	on:click={() => openPickerOnClick && inputRef.showPicker()}
	on:drag|preventDefault|stopPropagation
	on:dragstart|preventDefault|stopPropagation
	on:dragend|preventDefault|stopPropagation
	on:dragenter|preventDefault|stopPropagation
	on:dragover|preventDefault|stopPropagation
	on:dragleave|preventDefault|stopPropagation
	on:drop|preventDefault|stopPropagation={handleDrop}
>
	<slot />
	<input
		class="sr-only"
		type="file"
		name="dropzone"
		id="dropzone"
		tabindex="-1"
		{accept}
		bind:this={inputRef}
	/>
</div>
