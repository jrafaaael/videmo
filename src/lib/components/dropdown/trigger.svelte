<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDropdownContext } from './context';

	const {
		elements: { trigger }
	} = getDropdownContext();
</script>

<button use:melt={$trigger} {...$$restProps}>
	<slot />
</button>
