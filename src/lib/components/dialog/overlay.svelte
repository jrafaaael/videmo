<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	const {
		elements: { overlay }
	} = getDialogContext();
</script>

<div use:melt={$overlay} {...$$restProps} />
