<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getContextMenuContext } from './context';

	const {
		elements: { item }
	} = getContextMenuContext();
</script>

<button use:melt={$item} {...$$restProps} on:m-click>
	<slot />
</button>
