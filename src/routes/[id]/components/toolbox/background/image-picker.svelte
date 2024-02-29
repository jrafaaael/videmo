<script lang="ts">
	import { WALLPAPERS } from '../../../utils/constants';
	import { background } from '../../../stores/background.store';
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4">
	{#each WALLPAPERS as wallpaper}
		<label
			class="rounded-lg overflow-hidden outline outline-2 outline-transparent outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95 has-[:checked]:outline-white/90 has-[:checked]:hover:scale-100"
			for={wallpaper.name}
		>
			<img class="aspect-square object-fill" src={wallpaper.url} alt="{wallpaper.name} wallpaper" />
			<input
				checked={typeof $background !== 'string' && wallpaper.name === $background.name}
				type="radio"
				class="sr-only"
				name="wallpaper"
				value={wallpaper.name}
				id={wallpaper.name}
				on:input={() => ($background = wallpaper)}
			/>
		</label>
	{/each}
</div>
