import { getContext, setContext } from 'svelte';
import { type CreateDialogProps, type Dialog, createDialog } from '@melt-ui/svelte';

const NAME = 'dialog';

export function getDialogContext() {
	return getContext<Dialog>(NAME);
}

export function setDialogContext(props: CreateDialogProps) {
	const dialog = createDialog(props);

	setContext(NAME, dialog);

	return {
		...dialog
	};
}
