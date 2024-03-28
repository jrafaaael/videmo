import { getContext, setContext } from 'svelte';
import {
	type CreateDropdownMenuProps,
	type DropdownMenu,
	createDropdownMenu
} from '@melt-ui/svelte';

const NAME = 'dropdown';

export function getDropdownContext() {
	return getContext<DropdownMenu>(NAME);
}

export function setDropdownContext(props: CreateDropdownMenuProps) {
	const dropdown = createDropdownMenu(props);

	setContext(NAME, dropdown);

	return {
		...dropdown
	};
}
