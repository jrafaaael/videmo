<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getSelectContext } from './context';

	export let value: string;
	export let label: string;

	const {
		elements: { option },
		states: { open },
		helpers: { isSelected }
	} = getSelectContext();
</script>

{#if $open}
	<div use:melt={$option({ value, label })} {...$$restProps}>
		<slot isSelected={$isSelected(value)} />
	</div>
{/if}
