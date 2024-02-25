<script lang="ts">
	import { secondsToTime } from '$lib/utils/seconds-to-time';
	import { recording } from '../stores/recording.store';

	const INDICATORS_PER_DURATION = {
		10: {
			big: 1,
			small: 1
		},
		30: {
			big: 2,
			small: 1
		},
		default: {
			big: 10,
			small: 5
		}
	};
	$: totalVideoDuration = $recording?.duration;
	$: greatestSecondLessThanDuration = Math.floor(totalVideoDuration ?? 0);
	$: seconds = [...Array(greatestSecondLessThanDuration + 1).keys()];
	$: availableWidth = (greatestSecondLessThanDuration * 100) / (totalVideoDuration ?? 1);
	$: indicator = (Object.keys(INDICATORS_PER_DURATION).find(
		(time) => +time >= greatestSecondLessThanDuration
	) ?? 'default') as keyof typeof INDICATORS_PER_DURATION;
</script>

<div
	class="w-full max-w-[100vw] flex items-end"
	style="gap: calc(({availableWidth}%/{seconds.length - 1}) - 2px);"
>
	{#each seconds as num}
		{#if num % INDICATORS_PER_DURATION[indicator].big === 0}
			<div class="flex flex-col items-center relative z-10">
				<span class="text-xs text-white/40 absolute -top-4">
					{secondsToTime(num)}
				</span>
				<div class="w-0.5 h-4 bg-white/20 translate-y-1/2" />
			</div>
		{:else if num % INDICATORS_PER_DURATION[indicator].small === 0}
			<div class="w-0.5 h-2 bg-white/20 translate-y-0.5" />
		{:else}
			<div class="w-0.5 h-2 bg-white/20 translate-y-0.5 invisible" />
		{/if}
	{/each}
</div>
