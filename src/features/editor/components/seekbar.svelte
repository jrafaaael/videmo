<script lang="ts">
  import { recording } from "../../../stores/recording.store";

  export let time: number;
  $: position = (time * 100) / $recording.duration;
</script>

<button
  class="h-[calc(100%+8px)] absolute bottom-0 z-50 transition-all ease-linear cursor-col-resize"
  style="left: {position}%;"
>
  <div class="h-full relative">
    <div
      class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2"
    />
    <div class="w-0.5 h-full bg-orange-hard" />
  </div>
</button>
