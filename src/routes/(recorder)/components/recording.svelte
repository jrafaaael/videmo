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
	let newName = name;

	async function handleRemoveById(id: string) {
		const root = await navigator.storage.getDirectory();

		await root.removeEntry(id, { recursive: true });

		dispatcher('remove');
	}

	function handleRename() {
		if (name === newName) return;

		const info = JSON.parse(localStorage.getItem(id) ?? '{}');
		const infoWithName = { ...info, name: newName };

		localStorage.setItem(id, JSON.stringify(infoWithName));

		dispatcher('rename');
	}
</script>

<article class="flex flex-col gap-2">
	<a href="/{id}">
		<span class="w-full aspect-video bg-white/5 border border-white/5 rounded-md inline-block" />
	</a>
	<div class="flex justify-between items-center gap-16">
		<h3 class="text-sm font-medium line-clamp-1 flex-1">
			<a class="w-full py-2 inline-block" href="/{id}" tabindex="-1">
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
				<Dropdown.Item
					class="w-36 outline-none hover:bg-white/5 focus:bg-white/5"
					on:m-click={() => ($open = true)}
				>
					<Dialog.Root {open}>
						<Dialog.Trigger
							class="w-full py-1 px-2 flex items-center gap-2 cursor-pointer outline-none"
						>
							<span class="w-4 aspect-square inline-block text-neutral-50/50">
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
							<form
								on:submit|preventDefault={() => {
									handleRename();
									$open = false;
								}}
							>
								<label for="rename" class="mb-2 inline-block text-neutral-50 text-sm">
									New name
								</label>
								<input
									type="text"
									name="rename"
									id="rename"
									autocomplete="off"
									placeholder="name"
									class="w-full p-1 px-2 bg-transparent border-2 border-white/10 rounded text-base outline-none ring ring-transparent focus:border-purple-600/80 focus:ring-purple-600/25"
									bind:value={newName}
								/>
							</form>
							<div class="mt-8 flex justify-end gap-2">
								<Dialog.Close
									class="w-20 py-1 bg-white/5 border border-white/5 rounded-md text-sm text-neutral-50 hover:bg-white/10 hover:border-white/10"
								>
									Cancel
								</Dialog.Close>
								<Dialog.Close
									class="w-20 py-1 bg-purple-600 rounded-md text-sm text-neutral-50 hover:bg-purple-600/90"
									on:m-click={handleRename}
								>
									Save
								</Dialog.Close>
							</div>
						</Dialog.Content>
					</Dialog.Root>
				</Dropdown.Item>
				<Dropdown.Item
					class="w-36 outline-none hover:bg-red-600/15 focus:bg-red-600/15"
					on:m-click={async () => await handleRemoveById(id)}
				>
					<button
						class="w-full py-1 px-2 text-red-500 flex items-center gap-2 cursor-pointer"
						on:click={async () => await handleRemoveById(id)}
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
