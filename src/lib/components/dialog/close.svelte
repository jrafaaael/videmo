<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	const {
		elements: { close }
	} = getDialogContext();
</script>

<button use:melt={$close} {...$$restProps}>
	<slot />
</button>
