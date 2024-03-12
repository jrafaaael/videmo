<script lang="ts">
	import { edits } from '../stores/edits.store';
	import { videoStatus } from '../stores/video-status.store';
	import TimeIndicator from './time-indicator.svelte';
	import Seeker from './seeker.svelte';
	import Trimmer from './trimmer.svelte';
	import ZoomList from './zoom-list.svelte';

	export let pause: () => void;
	let isTrimming = false;
</script>

<div class="overflow-x-auto">
	<div class="w-fit min-w-full">
		<div class="w-full h-12 px-10 border-b-2 border-b-white/5 flex items-end">
			<TimeIndicator />
		</div>
		<div class="w-full px-10 bg-neutral-950">
			<div class="w-full py-6 flex flex-col gap-4 relative">
				<Seeker
					startAt={$edits.startAt}
					endAt={$edits.endAt}
					{isTrimming}
					on:changeTime={({ detail }) => {
						pause();
						$videoStatus.currentTime = detail.newTime;
					}}
				/>
				<div class="w-full h-10 relative">
					<Trimmer bind:isResizing={isTrimming} />
				</div>
				<ZoomList />
			</div>
		</div>
	</div>
</div>
