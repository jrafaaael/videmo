<script lang="ts">
	import * as Tabs from '$lib/components/tabs';
	import ColorPicker from './background/color-picker.svelte';
	import ImagePicker from './background/image-picker.svelte';
</script>

<Tabs.Root>
	<Tabs.List class="mb-8 p-1 bg-white/5 rounded-lg flex justify-between gap-4">
		<Tabs.Trigger
			id="image"
			class="w-full py-[5px] px-3 border-t-2 border-t-transparent rounded-md text-neutral-50/50 data-[state=active]:bg-white/5 data-[state=active]:border-t-white/[0.025] data-[state=active]:text-neutral-50 data-[state=active]:font-medium"
		>
			Image
		</Tabs.Trigger>
		<Tabs.Trigger
			id="color"
			class="w-full py-[5px] px-3 border-t-2 border-t-transparent rounded-md text-neutral-50/50 data-[state=active]:bg-white/5 data-[state=active]:border-t-white/[0.025] data-[state=active]:text-neutral-50 data-[state=active]:font-medium"
		>
			Color
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content id="image">
		<ImagePicker />
	</Tabs.Content>
	<Tabs.Content id="color">
		<ColorPicker />
	</Tabs.Content>
</Tabs.Root>
