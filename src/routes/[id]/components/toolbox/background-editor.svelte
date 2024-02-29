<script lang="ts">
	import * as Tabs from '$lib/components/tabs';
	import ColorPicker from './background/color-picker.svelte';
	import ImagePicker from './background/image-picker.svelte';
</script>

<Tabs.Root>
	<Tabs.List class="mb-8 flex justify-between gap-4">
		<Tabs.Trigger
			id="image"
			class="py-[6px] px-3 rounded-md w-full data-[state=active]:bg-white/10"
		>
			Image
		</Tabs.Trigger>
		<Tabs.Trigger
			id="color"
			class="py-[6px] px-3 rounded-md w-full data-[state=active]:bg-white/10"
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
