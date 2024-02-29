<script lang="ts">
	import { COLORS } from '../../../utils/constants';
	import { background } from '../../../stores/background.store';
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4">
	{#each COLORS as color}
		<label
			class="rounded-lg overflow-hidden outline outline-2 outline-transparent outline-offset-2 cursor-pointer transition-transform hover:scale-95 focus-within:scale-95 has-[:checked]:outline-white/90 has-[:checked]:hover:scale-100"
			for={color}
		>
			<div class="aspect-square object-fill" style="background-color: {color};" />
			<input
				checked={color === $background.name}
				type="radio"
				class="sr-only"
				name="wallpaper"
				value={color}
				id={color}
				on:input={() => background.updateBackground(color)}
			/>
		</label>
	{/each}
</div>
