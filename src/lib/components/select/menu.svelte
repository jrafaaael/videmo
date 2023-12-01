<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getSelectContext } from './context';

	const {
		elements: { menu },
		states: { open }
	} = getSelectContext();
</script>

{#if $open}
	<div use:melt={$menu} {...$$restProps}>
		<slot />
	</div>
{/if}
