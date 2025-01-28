<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	export let useOverlay: boolean = false;
	export let className: {
		dialog?: string;
		overlay?: string;
	} = {};
	const {
		elements: { portalled, content, overlay },
		states: { open }
	} = getDialogContext();
</script>

<div use:melt={$portalled}>
	{#if $open}
		{#if useOverlay}
			<div
				use:melt={$overlay}
				{...$$restProps}
				class={className.overlay ?? 'fixed inset-0 z-10 bg-black/50 backdrop-blur-sm'}
			/>
		{/if}
		<div use:melt={$content} {...$$restProps} class={className.dialog ?? ''}>
			<slot />
		</div>
	{/if}
</div>
