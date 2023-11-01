<script lang="ts">
  import { recording } from "../../../stores/recording.store";
  import { secondsToTime } from "../utils/seconds-to-time";

  let greatestSecondsLessThanDuration = Math.floor($recording.duration);
  let seconds = [...Array(greatestSecondsLessThanDuration + 1).keys()];
  let availableWidth =
    (greatestSecondsLessThanDuration * 100) / $recording.duration;
</script>

<div
  class="w-full max-w-[100vw] flex items-end"
  style="gap: calc(({availableWidth}%/{seconds.length - 1}) - 2px)"
>
  {#each seconds as num}
    <div class="flex flex-col items-center relative z-10">
      <span class="text-xs text-white/40 absolute -top-4">
        {secondsToTime(num)}
      </span>
      <div class="w-0.5 h-4 bg-white/20 translate-y-1/2" />
    </div>
    <!-- {#if num % 10 === 0}
      <div class="flex flex-col items-center relative z-10">
        <span class="text-xs text-white/40 absolute -top-4">
          {secondsToTime(num)}
        </span>
        <div class="w-0.5 h-4 bg-white/20 translate-y-1/2" />
      </div>
    {:else if num % 5 === 0}
      <div class="w-0.5 h-2 bg-white/20 translate-y-0.5" />
    {/if} -->
  {/each}
</div>
