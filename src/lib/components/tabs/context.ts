import { getContext, setContext } from 'svelte';
import { type CreateTabsProps, type Tabs, createTabs } from '@melt-ui/svelte';

const NAME = 'tabs';

export function getTabsContext() {
	return getContext<Tabs>(NAME);
}

export function setTabsContext(props: CreateTabsProps) {
	const tabs = createTabs(props);

	setContext(NAME, tabs);

	return {
		...tabs
	};
}
