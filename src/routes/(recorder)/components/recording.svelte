<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as Dropdown from '$lib/components/dropdown';
	import Trash from '$lib/components/icons/trash.svelte';
	import Dots from './icons/dots.svelte';
	import Rename from './icons/rename.svelte';

	export let name: string;
	export let id: string;
	const dispatcher = createEventDispatcher();

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
		<Dropdown.Root positioning={{ placement: 'bottom-start', gutter: 5 }}>
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
					<button class="w-full py-1 px-2 flex items-center gap-2 cursor-pointer">
						<span class="w-4 aspect-square inline-block">
							<Rename />
						</span>
						<span>Rename</span>
					</button>
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
