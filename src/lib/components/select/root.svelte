<script lang="ts">
	import type { CreateSelectProps } from '@melt-ui/svelte';
	import { setSelectContext } from './context';

	type $$Props = CreateSelectProps;

	export let positioning: $$Props['positioning'] = undefined;
	export let defaultSelected: $$Props['defaultSelected'] = undefined;
	export let selected: $$Props['selected'] = undefined;

	setSelectContext({
		forceVisible: true,
		positioning,
		defaultSelected,
		selected
	});
</script>

<slot />
