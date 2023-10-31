<script lang="ts">
  import { secondsToTime } from "../utils/seconds-to-time";
</script>

<div
  class="w-full h-12 px-10 border-b-2 border-b-white/5 flex justify-between items-end"
>
  {#each [...Array(10 + 1).keys()] as num}
    {#if num % 10 === 0}
      <div class="flex flex-col items-center relative z-10">
        <span class="text-xs text-white/40 absolute -top-4">
          {secondsToTime(num)}
        </span>
        <div class="w-1 h-4 bg-white/20 translate-y-1/2" />
      </div>
    {:else if num % 5 === 0}
      <div class="w-1 h-2 bg-white/20 translate-y-0.5" />
    {/if}
  {/each}
</div>
