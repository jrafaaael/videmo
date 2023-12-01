<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getSelectContext } from './context';

	const {
		elements: { trigger }
	} = getSelectContext();
</script>

<button use:melt={$trigger} {...$$restProps}>
	<slot />
</button>
