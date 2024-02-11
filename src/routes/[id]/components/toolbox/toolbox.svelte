<script lang="ts">
	import BackgroundEditor from './background-editor.svelte';
	import AppearanceEditor from './appearance-editor.svelte';
	import ZoomEditor from './zoom-editor.svelte';

	const OPTIONS = [
		{
			label: 'Background',
			content: BackgroundEditor
		},
		{
			label: 'Appearance',
			content: AppearanceEditor
		},
		{
			label: 'Zoom',
			content: ZoomEditor
		}
	] as const;
</script>

<aside
	class="min-w-[350px] max-w-full bg-neutral-900 border-r-2 border-r-white/5 basis-1/5 overflow-y-scroll"
>
	{#each OPTIONS as option}
		<details class="w-full border-b-2 border-b-white/5">
			<summary
				class="w-full p-5 font-medium flex justify-between items-center cursor-pointer list-none"
			>
				<span>
					{option.label}
				</span>
			</summary>
			<div class="px-5 pb-5">
				<svelte:component this={option.content} />
			</div>
		</details>
	{/each}
</aside>

<style>
	aside {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	aside::-webkit-scrollbar {
		display: none;
	}

	/* https://stackoverflow.com/questions/73195948/change-color-fill-of-a-svg-path-when-used-in-the-content-of-a-before-pseudo-el */
	summary::after {
		content: '';
		width: 16px;
		aspect-ratio: 1;
		background-color: rgba(250, 250, 250, 0.8);
		mask: url($lib/assets/images/icons/plus.svg);
	}

	details[open] > summary::after {
		mask: url($lib/assets/images/icons/minus.svg);
	}
</style>
