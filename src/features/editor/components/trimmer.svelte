<script lang="ts">
  import { recording } from "../../../stores/recording.store";

  type Resizer = "right" | "left";

  const MINIMUM_DURATION_IN_SECONDS = 0.5;
  let isResizing = false;
  let resizer: Resizer | null = null;
  let trimmerRef: HTMLDivElement;
  let mousePositionWhenResizingStart: number | null = null;
  let trimmerRectWhenResizingStart: DOMRect | null = null;

  function handleResizeStart(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
    direction: Resizer
  ) {
    trimmerRectWhenResizingStart = trimmerRef.getBoundingClientRect();
    mousePositionWhenResizingStart = e.pageX;
    isResizing = true;
    resizer = direction;
  }

  function handleResize(
    e: MouseEvent & { currentTarget: EventTarget & Document }
  ) {
    if (!isResizing || !resizer) {
      return;
    }

    const trimmerRect = trimmerRef.getBoundingClientRect();
    const constrains = trimmerRef.parentElement.getBoundingClientRect();

    if (resizer === "right") {
      const delta = e.pageX - mousePositionWhenResizingStart;
      const width = Math.min(
        constrains.width,
        constrains.width - trimmerRect.left + constrains.left,
        trimmerRectWhenResizingStart.width + delta
      );
      const widthInPercentage = (width * 100) / constrains.width;
      const duration = (widthInPercentage * $recording.duration) / 100;

      if (duration >= MINIMUM_DURATION_IN_SECONDS) {
        trimmerRef.style.setProperty(
          "width",
          widthInPercentage.toFixed(1) + "%"
        );
      }
    } else if (resizer === "left") {
      const delta = mousePositionWhenResizingStart - e.pageX;
      const left = trimmerRectWhenResizingStart.left - delta - constrains.left;
      const width =
        left >= 0
          ? Math.min(constrains.width, trimmerRectWhenResizingStart.width + delta)
          : Math.min(constrains.width, trimmerRectWhenResizingStart.width + left + delta);
      const widthInPercentage = (width * 100) / constrains.width;
      const leftInPercentage = Math.max(0, (left * 100) / constrains.width);
      const duration = (widthInPercentage * $recording.duration) / 100;

      if (duration >= MINIMUM_DURATION_IN_SECONDS) {
        trimmerRef.style.setProperty(
          "width",
          widthInPercentage.toFixed(1) + "%"
        );
        trimmerRef.style.setProperty("left", leftInPercentage.toFixed(1) + "%");
      }
    }
  }
</script>

<svelte:document
  on:mousemove={handleResize}
  on:mouseup={() => {
    isResizing = false;
    resizer = null;
  }}
/>

<div
  class="w-full h-10 bg-blue-500/30 rounded-md flex justify-between items-center overflow-hidden relative"
  style="width: var(--width, 100%); left: var(--left, 0)"
  bind:this={trimmerRef}
>
  <button
    class="w-auto h-full px-4 cursor-ew-resize absolute top-0 left-0"
    on:mousedown={(e) => handleResizeStart(e, "left")}
  >
    <div class="w-1 h-1/2 bg-white/50 rounded-full" />
  </button>
  <button
    class="w-auto h-full px-4 cursor-ew-resize absolute top-0 right-0"
    on:mousedown={(e) => handleResizeStart(e, "right")}
  >
    <div class="w-1 h-1/2 bg-white/50 rounded-full" />
  </button>
</div>
