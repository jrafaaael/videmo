<script lang="ts">
	import { background } from '../../stores/background.store';
	import { WALLPAPERS } from '../../utils/constants';
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4">
	{#each WALLPAPERS as wallpaper}
		<label
			class="rounded-lg overflow-hidden outline outline-2 outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95
			{$background.name === wallpaper.name ? 'outline-white/90 hover:scale-100' : 'outline-transparent'}"
			for={wallpaper.name}
		>
			<img class="aspect-square object-fill" src={wallpaper.url} alt="{wallpaper.name} wallpaper" />
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
