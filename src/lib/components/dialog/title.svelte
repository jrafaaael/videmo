<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getDialogContext } from './context';

	const {
		elements: { title }
	} = getDialogContext();
</script>

<h2 use:melt={$title} {...$$restProps}>
	<slot />
</h2>
