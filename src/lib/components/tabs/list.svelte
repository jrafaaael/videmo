<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getTabsContext } from './context';

	const {
		elements: { list }
	} = getTabsContext();
</script>

<div use:melt={$list} {...$$restProps}>
	<slot />
</div>
