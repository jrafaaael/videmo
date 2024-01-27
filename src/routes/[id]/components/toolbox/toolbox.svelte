<script lang="ts">
	import * as Accordion from '$lib/components/accordion';
	import ChevronDown from '../icons/chevron-down.filled.svelte';
	import BackgroundEditor from './background-editor.svelte';
	import AppearanceEditor from './appearance-editor.svelte';
	import ZoomEditor from './zoom-editor.svelte';

	const OPTIONS = [
		{
			id: 'background',
			label: 'Background',
			content: BackgroundEditor
		},
		{
			id: 'appearance',
			label: 'Appearance',
			content: AppearanceEditor
		},
		{
			id: 'zoom',
			label: 'Zoom',
			content: ZoomEditor
		}
	] as const;
</script>

<aside class="min-w-[350px] bg-neutral-900 border-r-2 border-r-white/5 basis-1/5">
	<Accordion.Root defaultValue={OPTIONS.at(0)?.id}>
		<div class="w-full">
			{#each OPTIONS as item}
				<Accordion.Item class="w-full border-b border-b-white/10" id={item.id}>
					<Accordion.Trigger
						class="w-full h-16 px-4 flex justify-start items-center gap-2 relative"
						id={item.id}
					>
						<div class="w-4 aspect-square text-neutral-500">
							<ChevronDown />
						</div>
						{item.label}
					</Accordion.Trigger>
					<Accordion.Content class="px-4 pb-4" id={item.id}>
						<svelte:component this={item.content} />
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</div>
	</Accordion.Root>
</aside>
