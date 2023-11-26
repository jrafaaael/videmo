import { getContext, setContext } from 'svelte';
import { type CreateAccordionProps, type Accordion, createAccordion } from '@melt-ui/svelte';

const NAME = 'accordion';

export function getAccordionContext() {
	return getContext<Accordion>(NAME);
}

export function setAccordionContext(props: CreateAccordionProps) {
	const accordion = createAccordion(props);

	setContext(NAME, accordion);

	return {
		...accordion
	};
}
