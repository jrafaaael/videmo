<script lang="ts">
	import { tick } from 'svelte';
	import { videoStatus } from '../stores/video-status.store';
	import { cuts, currentCutIndex, currentCut } from '../stores/cuts.store';
	import { recording } from '../stores/recording.store';
	import { MIN_CUT_DURATION_IN_SECONDS } from '../utils/constants';
	import Cut from './icons/cut.svelte';

	async function handleCut() {
		$currentCutIndex = $cuts.findIndex(
			(cut) => $videoStatus.currentTime >= cut.startAt && $videoStatus.currentTime <= cut.endAt
		);

		await tick();

		if (
			$videoStatus.currentTime <= $currentCut?.startAt + MIN_CUT_DURATION_IN_SECONDS ||
			$videoStatus.currentTime >= $currentCut?.endAt - MIN_CUT_DURATION_IN_SECONDS
		)
			return;

		$cuts = [
			...$cuts.toSpliced($currentCutIndex, 1),
			{ startAt: $currentCut?.startAt ?? 0, endAt: $videoStatus.currentTime },
			{ startAt: $videoStatus.currentTime, endAt: $currentCut?.endAt ?? $recording!.duration }
		];
	}
</script>

<button
	class="py-[5px] px-3 rounded-md text-neutral-300 flex justify-center items-center gap-2 absolute left-10 transition-all hover:bg-white/5 hover:text-neutral-200"
	on:click={handleCut}
>
	<span class="w-4 aspect-square">
		<Cut />
	</span>
	<span>Cut</span>
</button>
