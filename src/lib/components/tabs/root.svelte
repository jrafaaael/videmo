<script lang="ts">
	import { melt, type CreateTabsProps } from '@melt-ui/svelte';
	import { setTabsContext } from './context';

	type $$Props = CreateTabsProps;

	export let loop: $$Props['loop'] = undefined;
	export let defaultValue: $$Props['defaultValue'] = undefined;
	export let value: $$Props['value'] = undefined;

	const {
		elements: { root },
		states: { value: _internalValue }
	} = setTabsContext({
		loop,
		defaultValue,
		value
	});
</script>

<div use:melt={$root}>
	<slot value={_internalValue} />
</div>
