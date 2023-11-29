<script lang="ts">
	import { appearence } from '../../stores/general-appearance.store';
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-col">
		<label for="padding" class="text-neutral-300">Padding:</label>
		<div class="flex gap-4">
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
	</div>
</div>
