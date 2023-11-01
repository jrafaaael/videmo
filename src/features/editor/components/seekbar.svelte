<script lang="ts">
  import ResizeObserver from "../../../components/resize-observer.svelte";
  import { recording } from "../../../stores/recording.store";
  import { secondsToPixels } from "../utils/seconds-to-pixels";

  export let time: number;
</script>

<ResizeObserver let:inlineSize>
  <div class="w-full h-full absolute top-0 left-0">
    <div
      class="h-[calc(100%+8px)] absolute bottom-0 z-50 transition-all ease-linear"
      style="left: {secondsToPixels({
        sec: time,
        totalPixels: inlineSize,
        totalSeconds: $recording.duration,
      })}px;"
    >
      <div class="h-full relative">
        <div
          class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2"
        />
        <div class="w-0.5 h-full bg-orange-hard" />
      </div>
    </div>
  </div>
</ResizeObserver>
