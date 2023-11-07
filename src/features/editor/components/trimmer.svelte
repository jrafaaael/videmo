<script lang="ts">
  type Resizer = "right" | "left";
  let isResizing = false;
  let resizer: Resizer | null = null;
  let trimmerRef: HTMLDivElement;
  let mousePositionWhenResizingStart = null;
  let initialTrimmerRect: DOMRect | null = null;

  function handleResizeStart(
    e: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
    direction: Resizer
  ) {
    initialTrimmerRect = trimmerRef.getBoundingClientRect();
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
        initialTrimmerRect.width + delta
      );

      trimmerRef.style.width = width.toFixed(1) + "px";
    } else if (resizer === "left") {
      const delta = mousePositionWhenResizingStart - e.pageX;
      const left = initialTrimmerRect.left - delta - constrains.left;
      const width =
        left >= 0
          ? Math.min(constrains.width, initialTrimmerRect.width + delta)
          : Math.min(constrains.width, initialTrimmerRect.width + left + delta);

      trimmerRef.style.left = Math.max(0, left).toFixed(1) + "px";
      trimmerRef.style.width = width.toFixed(1) + "px";
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
