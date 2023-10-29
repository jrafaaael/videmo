<script lang="ts">
  import { video } from "../../stores/video.store";
  import Header from "./components/header.svelte";
  import Controls from "./components/controls.svelte";
  import TimeIndicator from "./components/time-indicator.svelte";
  import Timeline from "./components/timeline.svelte";
  import Trimmer from "./components/trimmer.svelte";
</script>

<main
  class="w-full h-full bg-neutral-950 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-4"
>
  <Header />
  <section class="w-full px-10 flex justify-center items-center">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video class="w-full max-h-full aspect-video" src={$video.blobUrl} />
  </section>
  <footer class="w-full bg-neutral-900 border-t-2 border-t-white/5 flex">
    <div class="border-r-2 border-r-white/5">
      <div
        class="h-12 px-4 border-b-2 border-b-white/5 flex items-center gap-12"
      >
        <Controls />
        <TimeIndicator />
      </div>
    </div>
    <div class="w-full">
      <Timeline />
      <div class="w-full py-6 px-10 bg-neutral-950 flex flex-col gap-4">
        <Trimmer />
        <Trimmer />
      </div>
    </div>
  </footer>
</main>
