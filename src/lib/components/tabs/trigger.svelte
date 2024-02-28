<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getTabsContext } from './context';

	export let id: string;

	const {
		elements: { trigger }
	} = getTabsContext();
</script>

<button use:melt={$trigger(id)} {...$$restProps}>
	<slot />
</button>
