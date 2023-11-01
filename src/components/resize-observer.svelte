<script lang="ts">
  import { onMount } from "svelte";

  let containerRef: HTMLDivElement;
  let inlineSize: number;

  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        console.log(entry);
        inlineSize = entry.contentRect.width;
      });
    });

    observer.observe(containerRef);

    return () => observer.disconnect();
  });
</script>

<div bind:this={containerRef} {...$$restProps}>
  <slot {inlineSize} />
</div>
