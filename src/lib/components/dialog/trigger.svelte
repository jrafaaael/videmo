<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	const {
		elements: { trigger }
	} = getDialogContext();
</script>

<button use:melt={$trigger} {...$$restProps}>
	<slot />
</button>
