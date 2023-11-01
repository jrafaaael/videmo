<script lang="ts">
  import ResizeObserver from "../../../components/resize-observer.svelte";
  import { recording } from "../../../stores/recording.store";
  import { secondsToPixels } from "../utils/seconds-to-pixels";

  export let time: number;
  let seekbarRef: HTMLDivElement;
</script>

<ResizeObserver element={seekbarRef?.parentElement} let:inlineSize>
  <div
    class="h-[calc(100%+8px)] absolute bottom-0 z-50 transition-all ease-linear cursor-col-resize"
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
</ResizeObserver>
