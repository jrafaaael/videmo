<script lang="ts">
	import type { CreateSelectProps } from '@melt-ui/svelte';
	import { setDialogContext } from './context';

	type $$Props = CreateSelectProps;
	export let open: $$Props['open'] = undefined;

	setDialogContext({
		preventScroll: false,
		open
	});
</script>

<slot />
