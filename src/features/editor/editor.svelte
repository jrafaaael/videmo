<script lang="ts">
  import { video } from "../../stores/video.store";
  import Header from "./components/header.svelte";
  import Timeline from "./components/timeline.svelte";
  import Trimmer from "./components/trimmer.svelte";
</script>

<main class="w-full h-full bg-neutral-950 flex flex-col">
  <Header />
  <section class="w-full max-w-5xl aspect-video m-auto">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video src={$video.blobUrl} />
  </section>
  <footer class="w-full bg-neutral-900 border-t-2 border-t-white/5">
    <Timeline />
    <div class="w-full py-5 px-10 bg-neutral-950 flex flex-col gap-5">
      <Trimmer />
    </div>
  </footer>
</main>
