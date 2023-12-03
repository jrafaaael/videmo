<script lang="ts">
	import { writable } from 'svelte/store';
	import * as Select from '$lib/components/select';
	import { recording } from '$lib/stores/recording.store';
	import { EXPORT_OPTIONS } from '../utils/export-options';
	import { download } from '../utils/download';
	import Trash from './icons/trash.svelte';
	import ChrevronDown from './icons/chevron-down.outlined.svelte';
	import Download from './icons/download.svelte';

	export let getFrameAsImage: () => string;
	let extension = writable(EXPORT_OPTIONS.at(0));

	function save() {
		if ($extension.value === '.png') {
			download($recording?.id ?? 'image' + $extension.value, getFrameAsImage());
		}
	}
</script>

<header
	class="h-16 px-10 bg-neutral-900 border-b-2 border-b-white/5 shrink-0 flex justify-between items-center gap-8"
>
	<a
		href="/"
		class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
	>
		<div class="w-4 aspect-square">
			<Trash />
		</div>
	</a>
	<h1 class="text-xl font-bold leading-none flex">
		<span class="line-clamp-1 break-all grow shrink-0 basis-0">
			{$recording?.id}
		</span>
		<Select.Root
			selected={extension}
			defaultSelected={$extension}
			positioning={{ placement: 'bottom-start' }}
		>
			<Select.Trigger class="grow-0 shrink flex items-center gap-1">
				<span>{$extension?.label}</span>
				<div class="w-4 aspect-square translate-y-[2px]">
					<ChrevronDown />
				</div>
			</Select.Trigger>
			<Select.Menu
				class="bg-neutral-800 border-2 border-white/5 rounded-md flex flex-col gap-1 overflow-hidden"
			>
				{#each EXPORT_OPTIONS as option}
					<Select.Option class="py-1 pl-4 px-16 cursor-pointer hover:bg-neutral-600/30" {...option}>
						{option.label}
					</Select.Option>
				{/each}
			</Select.Menu>
		</Select.Root>
	</h1>
	<button class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2" on:click={save}>
		<div class="w-4 aspect-square">
			<Download />
		</div>
		<span>Export</span>
	</button>
</header>
