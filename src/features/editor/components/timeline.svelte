<script lang="ts">
  import ResizeObserver from "../../../components/resize-observer.svelte";
  import { recording } from "../../../stores/recording.store";
  import { secondsToPixels } from "../utils/seconds-to-pixels";
  import { secondsToTime } from "../utils/seconds-to-time";

  let seconds = [...Array(Math.floor($recording.duration) + 1).keys()];
</script>

<ResizeObserver class="w-full" let:inlineSize>
  {@const gap = secondsToPixels({
    sec: 1,
    totalPixels: inlineSize,
    totalSeconds: $recording.duration,
  })}
  <div class="w-full flex items-end" style="gap: {gap}px">
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
</ResizeObserver>
