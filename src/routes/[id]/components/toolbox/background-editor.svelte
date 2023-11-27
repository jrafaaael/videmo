<script lang="ts">
	import { WALLPAPERS } from '../../utils/wallpapers';

	let selected = WALLPAPERS.at(0)?.name;
</script>

<div class="flex flex-wrap gap-4">
	{#each WALLPAPERS as wallpaper}
		<label
			class="rounded-lg overflow-hidden outline outline-2 outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95
			{selected === wallpaper.name ? 'outline-white/90 hover:scale-100' : 'outline-transparent'}"
			for={wallpaper.name}
		>
			<img
				class="w-10 aspect-square object-fill"
				src={wallpaper.url}
				alt="{wallpaper.name} wallpaper"
			/>
			<input
				type="radio"
				class="sr-only"
				name="wallpaper"
				value={wallpaper.name}
				id={wallpaper.name}
				bind:group={selected}
			/>
		</label>
	{/each}
</div>
