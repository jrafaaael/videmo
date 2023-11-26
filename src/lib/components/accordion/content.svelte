<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getAccordionContext } from './context';

	export let id: string;

	const {
		elements: { content },
		helpers: { isSelected }
	} = getAccordionContext();
</script>

{#if $isSelected(id)}
	<div use:melt={$content(id)} {...$$restProps}>
		<slot />
	</div>
{/if}
