import { getContext, setContext } from 'svelte';
import { type CreateContextMenuProps, type ContextMenu, createContextMenu } from '@melt-ui/svelte';

const NAME = 'context-menu';

export function getContextMenuContext() {
	return getContext<ContextMenu>(NAME);
}

export function setContextMenuContext(props: CreateContextMenuProps) {
	const contextMenu = createContextMenu(props);

	setContext(NAME, contextMenu);

	return {
		...contextMenu
	};
}
