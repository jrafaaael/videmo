<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	export let title: string;
	export let className: {
		title?: string;
	} = {};
	const {
		elements: { portalled, content, title: titleElement },
		states: { open }
	} = getDialogContext();
</script>

<div use:melt={$portalled}>
	{#if $open}
		<slot name="overlay" />
		<div use:melt={$content} {...$$restProps}>
			<h2 use:melt={$titleElement} class={className?.title ?? 'text-lg font-medium'}>
				{title}
			</h2>
			<slot />
		</div>
	{/if}
</div>
