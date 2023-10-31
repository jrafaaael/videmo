<script lang="ts">
  import { recording } from "../../../stores/recording.store";
  import { secondsToPixels } from "../utils/seconds-to-pixels";
  import { secondsToTime } from "../utils/seconds-to-time";

  const seconds = [...Array(+$recording.duration.toFixed(0) + 1).keys()];
</script>

<div
  class="w-full h-12 px-10 border-b-2 border-b-white/5 flex items-end"
  style="gap: {secondsToPixels({
    sec: 1,
    totalPixels: 903.33,
    totalSeconds: $recording.duration,
  })}px"
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
