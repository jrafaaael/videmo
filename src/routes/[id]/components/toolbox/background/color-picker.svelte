<script lang="ts">
	import { page } from '$app/stores';
	import { COLORS } from '../../../utils/constants';
	import { background } from '../../../stores/background.store';
	import Plus from '../../icons/plus.svelte';

	let folderName = $page.params.id;
	let picker: HTMLInputElement;
	let savedColors: string[] =
		JSON.parse(localStorage.getItem(folderName) ?? '{}')?.savedColors ?? [];
</script>

<div class="grid grid-cols-[repeat(auto-fill,minmax(40px,1fr))] gap-4">
	<div class="border-2 border-white/10 rounded-lg hover:scale-95">
		<button
			class="w-full h-full flex justify-center items-center"
			on:click={() => {
				picker.showPicker();
			}}
		>
			<span class="w-4 aspect-square inline-block">
				<Plus />
			</span>
		</button>
		<input
			class="sr-only"
			type="color"
			name="color-picker"
			id="color-picker"
			bind:this={picker}
			bind:value={$background}
			on:change={(e) => {
				const color = e.currentTarget.value;
				const config = JSON.parse(localStorage.getItem(folderName) ?? '{}');
				const newColors = config.savedColors ? [color, ...config.savedColors] : [color];

				savedColors = newColors;
				localStorage.setItem(folderName, JSON.stringify({ ...config, savedColors: newColors }));
			}}
		/>
	</div>
	{#each [...savedColors, ...COLORS] as color}
		<label
			class="rounded-lg overflow-hidden outline outline-2 outline-transparent outline-offset-2 cursor-pointer transition-transform hover:scale-95 has-[:checked]:outline-white/90 has-[:checked]:scale-100"
			for={color}
		>
			<div class="aspect-square" style="background-color: {color};" />
			<input
				checked={typeof $background === 'string' && color === $background}
				type="radio"
				class="sr-only"
				name="wallpaper"
				value={color}
				id={color}
				on:input={() => ($background = color)}
			/>
		</label>
	{/each}
</div>
