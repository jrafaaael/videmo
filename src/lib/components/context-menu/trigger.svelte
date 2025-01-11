<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getContextMenuContext } from './context';

	const {
		elements: { trigger }
	} = getContextMenuContext();
</script>

<button use:melt={$trigger} {...$$restProps}>
	<slot />
</button>
