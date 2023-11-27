<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { getAccordionContext } from './context';

	export let id: string;
	let classes = $$restProps.class;

	const {
		elements: { content },
		helpers: { isSelected }
	} = getAccordionContext();
</script>

<div
	use:melt={$content(id)}
	{...$$restProps}
	class="{classes} {$isSelected(id) ? 'block' : 'hidden'}"
>
	<slot />
</div>
