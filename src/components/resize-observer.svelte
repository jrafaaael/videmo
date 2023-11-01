<script lang="ts">
  import { onMount } from "svelte";

  export let element: HTMLElement | undefined = undefined;
  let containerRef: HTMLDivElement;
  let inlineSize: number;

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        inlineSize = entry.contentRect.width;
      });
    });

    observer.observe(element ?? containerRef);

    return () => observer.disconnect();
  });
</script>

<div bind:this={containerRef} {...$$restProps}>
  <slot {inlineSize} />
</div>
