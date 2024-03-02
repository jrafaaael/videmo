<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getTabsContext } from './context';

	export let id: string;

	const {
		elements: { content }
	} = getTabsContext();
</script>

<div use:melt={$content(id)} {...$$restProps}>
	<slot />
</div>
