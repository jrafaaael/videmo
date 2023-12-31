<script lang="ts">
	import { appearence } from '../../stores/general-appearance.store';
</script>

<ul class="flex flex-col gap-8">
	<li class="flex flex-col gap-2">
		<div class="flex justify-between gap-4">
			<label for="padding" class="text-neutral-300">Padding</label>
			<output class="tabular-nums">
				{$appearence.padding.toString(10).padStart(3, '0')}<span class="text-xs">px</span>
			</output>
		</div>
		<input
			type="range"
			name="padding"
			id="padding"
			min="0"
			max="100"
			class="w-full"
			bind:value={$appearence.padding}
		/>
	</li>

	<li class="flex flex-col gap-2">
		<div class="flex justify-between gap-4">
			<label for="corner-radius" class="text-neutral-300">Corner radius</label>
			<output class="tabular-nums">
				{$appearence.cornerRadius.toString(10).padStart(3, '0')}<span class="text-xs">px</span>
			</output>
		</div>
		<input
			type="range"
			name="corner-radius"
			id="corner-radius"
			min="0"
			max="100"
			class="w-full"
			bind:value={$appearence.cornerRadius}
		/>
	</li>

	<li class="flex flex-col gap-2">
		<div class="flex justify-between gap-4">
			<label for="shadow-blur" class="text-neutral-300">Shadow blur</label>
			<output class="tabular-nums">
				{$appearence.shadow.blur.toString(10).padStart(3, '0')}
			</output>
		</div>
		<input
			type="range"
			name="shadow-blur"
			id="shadow-blur"
			min="0"
			max="100"
			class="w-full"
			bind:value={$appearence.shadow.blur}
		/>
	</li>

	<li class="flex flex-col gap-2">
		<div class="flex justify-between gap-4">
			<label for="shadow-opacity" class="text-neutral-300">Shadow opacity</label>
			<output class="tabular-nums">
				{$appearence.shadow.opacity.toString(10).padStart(3, '0')}<span>%</span>
			</output>
		</div>
		<input
			type="range"
			name="shadow-opacity"
			id="shadow-opacity"
			min="0"
			max="100"
			class="w-full"
			bind:value={$appearence.shadow.opacity}
		/>
	</li>

	<li class="flex justify-between items-center gap-2">
		<label for="shadow-offset-x" class="text-neutral-300">Shadow offset x</label>
		<input
			type="number"
			name="shadow-offset-x"
			id="shadow-offset-x"
			min="-100"
			max="100"
			class="py-1 px-2 bg-transparent border-2 border-white/10 rounded-md"
			bind:value={$appearence.shadow.x}
		/>
	</li>

	<li class="flex justify-between items-center gap-2">
		<label for="shadow-offset-y" class="text-neutral-300">Shadow offset y</label>
		<input
			type="number"
			name="shadow-offset-y"
			id="shadow-offset-y"
			min="-100"
			max="100"
			class="py-1 px-2 bg-transparent border-2 border-white/10 rounded-md"
			bind:value={$appearence.shadow.y}
		/>
	</li>
</ul>
