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

<div
	role="button"
	tabindex="0"
	{...$$restProps}
	class={$$restProps.class}
	on:click={() => openPickerOnClick && inputRef.showPicker()}
	on:dragenter|preventDefault|stopPropagation={() => {}}
	on:dragover|preventDefault|stopPropagation={() => {}}
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
