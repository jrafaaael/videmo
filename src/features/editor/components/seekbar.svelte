<script lang="ts">
  export let position: number;
</script>

<div
  class="h-[calc(100%+8px)] absolute bottom-0 z-50 transition-all ease-linear"
  style="left: {position}px;"
>
  <div class="h-full relative">
    <div
      class="w-2 aspect-square bg-orange-hard rounded-full absolute left-1/2 -translate-x-1/2"
    />
    <div class="w-0.5 h-full bg-orange-hard" />
  </div>
</div>
