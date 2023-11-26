<script lang="ts">
	import type { CreateAccordionProps } from '@melt-ui/svelte';
	import { setAccordionContext } from './context';

	type $$Props = CreateAccordionProps;

	export let multiple: $$Props['multiple'] = true;
	export let defaultValue: $$Props['defaultValue'] = '';

	const {
		elements: { root }
	} = setAccordionContext({
		multiple,
		defaultValue
	});

	$: builder = $root;
</script>

<slot {builder} />
