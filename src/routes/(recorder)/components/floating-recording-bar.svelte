<script lang="ts">
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import * as Select from '$lib/components/select';
	import ChevronDown from '$lib/components/icons/chevron-down.svelte';
	import Check from '$lib/components/icons/check.svelte';
	import { isRecording } from '../stores/is-recording';
	import { COUNTDOWN_OPTIONS } from '../utils/constants';
	import { recordScreen } from '../utils/record-screen';
	import VideoSlash from './icons/video-slash.svelte';
	import Video from './icons/video.svelte';
	import Clock from './icons/clock.svelte';

	const countdownDuration = writable(COUNTDOWN_OPTIONS.at(0));
	let countdownInterval: number | null = null;
	let recordingStartDate: Date | null = null;
	let now: Date | null = null;
	let recordingDurationInterval: number | null = null;
	const { start, stop } = recordScreen({
		onStart() {
			countdownInterval = setInterval(() => (countdown -= 1000), 1000);
		},
		async onEnd(data) {
			clearInterval(recordingDurationInterval!);
			recordingDurationInterval = null;
			await goto(data.folder);
			$isRecording = false;
		}
	});
	$: countdown = $countdownDuration.value;
	$: recordingDuration = (now?.getTime() ?? 0) - (recordingStartDate?.getTime() ?? 0);

	async function handleClick() {
		if ($isRecording) {
			stop();
			return;
		}

		try {
			await start({ countdown });
			recordingStartDate = new Date();
			now = new Date();
			recordingDurationInterval = setInterval(() => (now = new Date()), 1000);
		} catch (error) {
			console.error(error);
		}
	}

	$: if (countdown <= 0) {
		clearInterval(countdownInterval!);
		$isRecording = true;
		countdownInterval = null;
	}
</script>

<footer
	class="w-auto h-12 rounded-full flex items-center fixed bottom-20 left-1/2 -translate-x-1/2 {!countdownInterval
		? 'bg-neutral-900 border-2 border-white/10'
		: 'bg-red-600 border-2 border-red-500/70'}"
>
	{#if !countdownInterval}
		<button class="h-full px-5 flex items-center gap-2" on:click={handleClick}>
			<span class="w-4 aspect-square text-neutral-50/50">
				{#if !$isRecording}
					<Video />
				{:else}
					<VideoSlash />
				{/if}
			</span>
			<span>{!$isRecording ? 'Start' : 'Stop'} recording</span>
		</button>
		<div class="w-[2px] h-[40%] bg-white/20" />
		{#if !$isRecording}
			<Select.Root
				selected={countdownDuration}
				defaultSelected={$countdownDuration}
				positioning={{ placement: 'top', gutter: 5 }}
			>
				<Select.Trigger class="h-full px-5 flex items-center gap-2">
					<span class="w-4 aspect-square text-neutral-50/50">
						<Clock />
					</span>
					<span>
						<span>Countdown:</span>
						<output class="font-bold tabular-nums">{$countdownDuration?.value / 1000}</output><span
							class="text-sm font-bold">s</span
						>
					</span>
					<span class="w-4 aspect-square rotate-180">
						<ChevronDown />
					</span>
				</Select.Trigger>
				<Select.Menu
					class="bg-neutral-800/80 backdrop-blur-lg border-2 border-white/5 rounded-md flex flex-col gap-1 overflow-hidden"
				>
					{#each [...COUNTDOWN_OPTIONS].reverse() as option}
						<Select.Option
							let:isSelected
							class="w-36 py-1 px-4 flex justify-between items-center gap-4 cursor-pointer data-[highlighted]:bg-white/10 data-[disabled]:text-neutral-400 data-[disabled]:cursor-not-allowed"
							{...option}
						>
							<span class={isSelected ? 'font-bold' : 'font-normal'}>{option.label}</span>
							{#if isSelected}
								<span class="w-3 aspect-square">
									<Check />
								</span>
							{/if}
						</Select.Option>
					{/each}
				</Select.Menu>
			</Select.Root>
		{:else}
			<output class="px-5 tabular-nums">{secondsToTime(recordingDuration / 1000)}</output>
		{/if}
	{:else}
		<div class="min-w-[150px] h-full px-4 flex justify-center items-center gap-12">
			{#each Array.from({ length: $countdownDuration.value / 1000 }, (_, i) => i + 1).reverse() as second}
				<span
					class="text-2xl font-bold {second >= countdown / 1000
						? 'text-neutral-50'
						: 'text-neutral-50/50'}"
				>
					{second}
				</span>
			{/each}
		</div>
	{/if}
</footer>
