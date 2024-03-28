<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDropdownContext } from './context';

	const {
		elements: { menu },
		states: { open }
	} = getDropdownContext();
</script>

{#if $open}
	<div use:melt={$menu} {...$$restProps}>
		<slot />
	</div>
{/if}
