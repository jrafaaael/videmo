<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getSelectContext } from './context';

	export let value: string | number;
	export let label: string;
	export let disabled = false;

	const {
		elements: { option },
		states: { open },
		helpers: { isSelected }
	} = getSelectContext();
</script>

{#if $open}
	<div use:melt={$option({ value, label, disabled })} {...$$restProps}>
		<slot isSelected={$isSelected(value)} />
	</div>
{/if}
