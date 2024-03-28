<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import * as Dropdown from '$lib/components/dropdown';
	import * as Dialog from '$lib/components/dialog';
	import Trash from '$lib/components/icons/trash.svelte';
	import Dots from './icons/dots.svelte';
	import Rename from './icons/rename.svelte';

	export let name: string;
	export let id: string;
	const dispatcher = createEventDispatcher();
	const open = writable(false);

	async function removeRecordingById(id: string) {
		const root = await navigator.storage.getDirectory();

		await root.removeEntry(id, { recursive: true });
	}
</script>

<article class="flex flex-col gap-2">
	<a href="/{id}">
		<span class="w-full aspect-video bg-white/5 border border-white/5 rounded-md inline-block" />
	</a>
	<div class="flex justify-between items-center">
		<h3 class="text-sm font-medium">
			<a class="py-2" href="/{id}">
				{name}
			</a>
		</h3>
		<Dropdown.Root
			positioning={{ placement: 'bottom-start', gutter: 5 }}
			onOpenChange={({ curr, next }) => {
				if ($open) return curr;

				return next;
			}}
		>
			<Dropdown.Trigger
				class="p-1 rounded flex items-center hover:bg-white/5 data-[state=open]:bg-white/5"
			>
				<span class="w-4 aspect-square inline-block">
					<Dots />
				</span>
			</Dropdown.Trigger>
			<Dropdown.Menu
				class="bg-neutral-800/80 backdrop-blur-lg border-2 border-white/5 rounded-md flex flex-col gap-1 overflow-hidden"
			>
				<Dropdown.Item class="w-36 hover:bg-white/5">
					<Dialog.Root {open}>
						<Dialog.Trigger class="w-full py-1 px-2 flex items-center gap-2 cursor-pointer">
							<span class="w-4 aspect-square inline-block">
								<Rename />
							</span>
							<span>Rename</span>
						</Dialog.Trigger>
						<Dialog.Content
							className={{
								dialog:
									'max-h-[85vh] w-[90vw] max-w-[450px] p-6 bg-neutral-800 border border-white/5 rounded-xl fixed left-1/2 top-1/2 z-10 shadow-lg -translate-x-1/2 -translate-y-1/2',
								title: 'mb-4 text-lg font-medium'
							}}
							title="Rename recording"
						>
							<Dialog.Overlay
								slot="overlay"
								class="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
							/>
							<form>
								<label for="rename" class="mb-2 inline-block text-neutral-50">New name</label>
								<input
									type="text"
									name="rename"
									id="rename"
									autocomplete="off"
									placeholder="name"
									class="w-full p-1 px-2 bg-transparent border-2 border-white/10 rounded text-base outline-none ring ring-transparent focus:border-blue-600/80 focus:ring-blue-600/25"
								/>
							</form>
							<div class="mt-8 flex justify-end gap-2">
								<Dialog.Close
									class="w-20 py-1 bg-white/5 border-t-2 border-t-white/5 rounded-md text-sm text-neutral-50 hover:bg-white/10"
								>
									Cancel
								</Dialog.Close>
								<Dialog.Close
									class="w-20 py-1 bg-gradient-to-b from-blue-700 to-blue-800 border-t-2 border-t-white/20 rounded-md text-sm text-neutral-50 hover:to-blue-700 hover:border-t-white/10"
								>
									Save
								</Dialog.Close>
							</div>
						</Dialog.Content>
					</Dialog.Root>
				</Dropdown.Item>
				<Dropdown.Item class="w-36 hover:bg-red-600/15">
					<button
						class="w-full py-1 px-2 text-red-500 flex items-center gap-2 cursor-pointer"
						on:click={async () => {
							await removeRecordingById(id);
							dispatcher('remove');
						}}
					>
						<span class="w-4 aspect-square inline-block">
							<Trash />
						</span>
						<span>Remove</span>
					</button>
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown.Root>
	</div>
</article>
