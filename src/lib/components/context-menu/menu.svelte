<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getContextMenuContext } from './context';

	const {
		elements: { menu },
	} = getContextMenuContext();
</script>

<div use:melt={$menu} {...$$restProps}>
	<slot />
</div>
