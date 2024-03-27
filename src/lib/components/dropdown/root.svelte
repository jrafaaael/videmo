<script lang="ts">
	import type { CreateSelectProps } from '@melt-ui/svelte';
	import { setDropdownContext } from './context';

	type $$Props = CreateSelectProps;

	export let positioning: $$Props['positioning'] = undefined;

	setDropdownContext({
		forceVisible: true,
		positioning,
		preventScroll: false
	});
</script>

<slot />
