<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getAccordionContext } from './context';

	export let id: string;

	const {
		elements: { trigger }
	} = getAccordionContext();
</script>

<button use:melt={$trigger(id)} {...$$restProps}>
	<slot />
</button>
