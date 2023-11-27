<script lang="ts">
	const WALLPAPERS_PATH = '/images/wallpapers';
	const wallpapers = ['big-sur.webp', 'sonoma.webp', 'ventura.webp'] as const;

	let selected = wallpapers.at(0);
</script>

<div class="flex flex-wrap gap-4">
	{#each wallpapers as wallpaper}
		{@const wallpaperName = wallpaper.split('.').at(0)}

		<label
			for={wallpaperName}
			class="rounded-lg overflow-hidden outline outline-2 outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95
			{selected === wallpaper.name ? 'outline-white/90 hover:scale-100' : 'outline-transparent'}"
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
