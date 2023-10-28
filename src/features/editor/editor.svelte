<script lang="ts">
  import { video } from "../../stores/video.store";
  import Controls from "./components/controls.svelte";
  import Header from "./components/header.svelte";
</script>

<main class="w-full h-full bg-neutral-950 flex flex-col">
  <Header />
  <section class="w-full max-w-5xl aspect-video m-auto">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={$video.blobUrl} />
  </section>
  <Controls />
</main>
