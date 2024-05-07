<script lang="ts">
	import * as Dialog from '$lib/components/dialog';
	import Crop from './icons/crop.svelte';
	import CropFrame from './crop-frame.svelte';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="py-[5px] px-3 rounded-md text-neutral-300 flex justify-center items-center gap-2 absolute right-10 transition-all hover:bg-white/5 hover:text-neutral-200"
	>
		<span class="w-4 aspect-square">
			<Crop />
		</span>
		<span>Crop</span>
	</Dialog.Trigger>
	<Dialog.Content
		title="Crop recording"
		className={{
			dialog:
				'w-[90vw] max-w-[1024px] max-h-[85vh] p-6 bg-neutral-800 border border-white/5 rounded-xl fixed left-1/2 top-1/2 z-20 shadow-lg -translate-x-1/2 -translate-y-1/2',
			title: 'mb-4 text-lg font-medium'
		}}
	>
		<Dialog.Overlay slot="overlay" class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm" />
		<CropFrame />
		<div class="mt-8 flex justify-end gap-2">
			<Dialog.Close
				class="w-20 py-1 bg-white/5 border border-white/5 rounded-md text-sm text-neutral-50 hover:bg-white/10 hover:border-white/10"
			>
				Cancel
			</Dialog.Close>
			<Dialog.Close
				class="w-20 py-1 bg-purple-600 rounded-md text-sm text-neutral-50 hover:bg-purple-600/90"
			>
				Save
			</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
