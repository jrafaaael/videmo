<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { recording } from "../../../stores/recording.store";

  export let time: number;
  export let isTrimming: boolean;
  export let paused: boolean;
  let isDragging = false;
  let seekbarRef: HTMLButtonElement;
  let dispatcher = createEventDispatcher();
  $: position = (time * 100) / $recording.duration;

  function handleChangeTime(
    e: MouseEvent & { currentTarget: EventTarget & Document }
  ) {
    if (isDragging) {
      const constrains = seekbarRef.parentElement.getBoundingClientRect();
      const positionInPx = Math.min(
        Math.max(e.clientX - constrains.x, 0),
        constrains.width
      );
      const positionInPercentage = (positionInPx * 100) / constrains.width;
      const newTime = (positionInPercentage * $recording.duration) / 100;

      position = positionInPercentage;

      dispatcher("changeTime", { newTime });
    }
  }
</script>

<svelte:document
  on:mousemove={handleChangeTime}
  on:mouseup|preventDefault={() => (isDragging = false)}
/>

<button
  class="h-[calc(100%+8px)] px-2 absolute bottom-0 z-50 cursor-col-resize {time <=
    0 ||
  isDragging ||
  isTrimming
    ? 'transition-none'
    : 'transition-all ease-linear'}"
  style="--position: {position}%; left: calc(var(--position, 0%) - 8px);"
  on:mousedown|preventDefault={() => (isDragging = true)}
  bind:this={seekbarRef}
>
  <div class="h-full relative">
    <div
      class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2"
    />
    <div class="w-0.5 h-full bg-orange-hard" />
  </div>
</button>
