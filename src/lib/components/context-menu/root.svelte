<script lang="ts">
	import type { CreateContextMenuProps } from '@melt-ui/svelte';
	import { setContextMenuContext } from './context';

	type $$Props = CreateContextMenuProps;

	export let positioning: $$Props['positioning'] = undefined;

	setContextMenuContext({
		positioning,
		preventScroll: false,
	});
</script>

<slot />
