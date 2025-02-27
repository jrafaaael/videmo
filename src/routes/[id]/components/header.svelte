<script lang="ts">
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import * as Select from '$lib/components/select';
	import ChevronDown from '$lib/components/icons/chevron-down.svelte';
	import Check from '$lib/components/icons/check.svelte';
	import { EXPORT_OPTIONS, Status } from '../utils/export-options';
	import { download } from '../utils/download';
	import ArrowFat from './icons/arrow-fat.svelte';
	import Loading from './icons/loading.animated.svelte';
	import Download from './icons/download.svelte';

	export let getFrameAsImage: () => string;
	export let getMP4: () => Promise<string>;
	const folderId = $page.params.id;
	const recordingInfo = JSON.parse(localStorage.getItem(folderId) ?? '{}');
	const folderName = recordingInfo.name ?? new Date(+folderId).toLocaleString();
	let extension = writable(EXPORT_OPTIONS.at(0));
	let isExporting = false;

	function exportAsImage() {
		const filename = folderName + $extension.value;
		const img = getFrameAsImage();

		download(filename, img);
		URL.revokeObjectURL(img);
	}

	async function exportAsMP4() {
		const filename = folderName + $extension.value;
		const mp4 = await getMP4();

		download(filename, mp4);
		URL.revokeObjectURL(mp4);
	}

	async function save() {
		if (isExporting) {
			return;
		}

		isExporting = true;

		const EXPORTERS = {
			'.png': exportAsImage,
			'.mp4': exportAsMP4,
			'.gif': () => null
		};

		await EXPORTERS[$extension.label]();

		isExporting = false;
	}
</script>

<header
	class="h-16 px-10 bg-neutral-900 border-b-2 border-b-white/5 shrink-0 flex justify-center items-center gap-8"
>
	<a
		href="/"
		class="p-2 rounded-md text-neutral-300 flex justify-center items-center absolute left-10 transition-all hover:bg-white/5 hover:text-neutral-200"
	>
		<span class="w-4 aspect-square inline-block -scale-100">
			<ArrowFat />
		</span>
	</a>
	<h1 class="text-xl font-bold leading-none flex">
		<span class="line-clamp-1 break-all grow shrink-0 basis-0">
			{folderName}
		</span>
		<Select.Root
			selected={extension}
			defaultSelected={$extension}
			positioning={{ placement: 'bottom-start', gutter: 12 }}
		>
			<Select.Trigger class="grow-0 shrink flex items-center gap-1">
				<span>{$extension?.label}</span>
				<span class="w-4 aspect-square translate-y-[2px]">
					<ChevronDown />
				</span>
			</Select.Trigger>
			<Select.Menu
				class="bg-neutral-800/80 backdrop-blur-lg border-2 border-white/5 rounded-md flex flex-col gap-1 overflow-hidden"
			>
				{#each EXPORT_OPTIONS as option}
					{@const disabled = option.status === Status.SOON}
					<Select.Option
						let:isSelected
						{disabled}
						class="w-36 py-1 px-4 flex justify-between items-center gap-4 cursor-pointer data-[highlighted]:bg-white/10 data-[disabled]:text-neutral-400 data-[disabled]:cursor-not-allowed"
						{...option}
					>
						<span class={isSelected ? 'font-bold' : 'font-normal'}>{option.label}</span>
						{#if isSelected}
							<span class="w-3 aspect-square">
								<Check />
							</span>
						{:else if option.status !== Status.AVAILABLE}
							<span class="text-xs uppercase">{option.status}</span>
						{/if}
					</Select.Option>
				{/each}
			</Select.Menu>
		</Select.Root>
	</h1>
	<button
		class="py-[5px] px-3 rounded-md flex items-center gap-2 absolute right-10 {isExporting
			? 'bg-neutral-600 text-neutral-400 cursor-not-allowed focus:outline-none'
			: 'bg-purple-600'}"
		tabindex={isExporting ? -1 : 0}
		on:click={save}
	>
		{#if isExporting}
			<div class="w-4 aspect-square">
				<Loading />
			</div>
			<span>Exporting</span>
		{:else}
			<div class="w-4 aspect-square">
				<Download />
			</div>
			<span>Export</span>
		{/if}
	</button>
</header>
