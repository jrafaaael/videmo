<script lang="ts">
	import * as Tabs from '$lib/components/tabs';
	import { background } from '../../stores/background.store';
	import { WALLPAPERS } from '../../utils/constants';
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
		<div class="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4">
			{#each WALLPAPERS as wallpaper}
				<label
					class="rounded-lg overflow-hidden outline outline-2 outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95
					{$background.name === wallpaper.name ? 'outline-white/90 hover:scale-100' : 'outline-transparent'}"
					for={wallpaper.name}
				>
					<img
						class="aspect-square object-fill"
						src={wallpaper.url}
						alt="{wallpaper.name} wallpaper"
					/>
					<input
						type="radio"
						class="sr-only"
						name="wallpaper"
						value={wallpaper.name}
						id={wallpaper.name}
						on:input={() => background.updateBackground(wallpaper.name)}
					/>
				</label>
			{/each}
		</div>
	</Tabs.Content>
	<Tabs.Content id="color">
		<p>color</p>
	</Tabs.Content>
</Tabs.Root>
