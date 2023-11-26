<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getAccordionContext } from './context';

  export let id: string;
  
	const {
		elements: { item },
	} = getAccordionContext();
</script>

<div use:melt={$item(id)} {...$$restProps}>
	<slot />
</div>
