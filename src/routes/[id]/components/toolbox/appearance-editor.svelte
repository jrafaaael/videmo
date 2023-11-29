<script lang="ts">
	import { appearence } from '../../stores/general-appearance.store';
</script>

<div class="flex justify-end gap-2">
	<label for="padding" class="mr-8 text-neutral-300">Padding:</label>
	<input
		type="range"
		name="padding"
		id="padding"
		min="0"
		max="100"
		class="w-full"
		bind:value={$appearence.padding}
	/>
	<output class="tabular-nums">
		{$appearence.padding.toString(10).padStart(3, '0')}px
	</output>
</div>
