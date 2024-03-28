<script lang="ts">
	import type { CreateSelectProps } from '@melt-ui/svelte';
	import { setDropdownContext } from './context';

	type $$Props = CreateSelectProps;

	export let positioning: $$Props['positioning'] = undefined;
	export let onOpenChange: $$Props['onOpenChange'] = undefined;

	setDropdownContext({
		forceVisible: true,
		preventScroll: false,
		positioning,
		onOpenChange
	});
</script>

<slot />
