<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	const {
		elements: { close }
	} = getDialogContext();
</script>

<button use:melt={$close} on:m-click {...$$restProps}>
	<slot />
</button>
