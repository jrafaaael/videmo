<script lang="ts">
	const WALLPAPERS_PATH = '/images/wallpapers';
	const wallpapers = ['big-sur.webp', 'sonoma.webp', 'ventura.webp'] as const;

	let selected = wallpapers.at(0);
</script>

<div class="flex flex-wrap gap-4">
	{#each wallpapers as wallpaper}
		{@const wallpaperName = wallpaper.split('.').at(0)}

		<label
			class="rounded-lg overflow-hidden border-2 border-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95
			{selected === wallpaper ? 'border-white/90 hover:scale-100' : 'border-transparent'}"
			for={wallpaperName}
		>
			<img
				class="w-10 aspect-square object-fill"
				src="{WALLPAPERS_PATH}/{wallpaper}"
				alt="{wallpaperName} wallpaper"
			/>
			<input
				type="radio"
				class="sr-only"
				name="wallpaper"
				value={wallpaper}
				id={wallpaperName}
				bind:group={selected}
			/>
		</label>
	{/each}
</div>
