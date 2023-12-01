import { getContext, setContext } from 'svelte';
import { type CreateSelectProps, type Select, createSelect } from '@melt-ui/svelte';

const NAME = 'select';

export function getSelectContext() {
	return getContext<Select>(NAME);
}

export function setSelectContext(props: CreateSelectProps) {
	const select = createSelect(props);

	setContext(NAME, select);

	return {
		...select
	};
}
