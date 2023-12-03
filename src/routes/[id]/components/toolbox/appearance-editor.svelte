<script lang="ts">
	import { appearence } from '../../stores/general-appearance.store';
</script>

<div class="flex flex-col gap-4">
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
</div>
