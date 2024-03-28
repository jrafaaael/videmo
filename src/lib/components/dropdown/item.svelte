<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDropdownContext } from './context';

	const {
		elements: { item }
	} = getDropdownContext();
</script>

<div use:melt={$item} {...$$restProps} on:m-click>
	<slot />
</div>
