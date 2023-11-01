<script lang="ts">
  import ResizeObserver from "../../components/resize-observer.svelte";
  import { recording } from "../../stores/recording.store";
  import Header from "./components/header.svelte";
  import Controls from "./components/controls.svelte";
  import Timeline from "./components/timeline.svelte";
  import Seekbar from "./components/seekbar.svelte";
  import Trimmer from "./components/trimmer.svelte";
  import { secondsToTime } from "./utils/seconds-to-time";

  let videoRef: HTMLVideoElement;
  let isPlaying = false;
  let currentTime = 0;
</script>

<main
  class="w-full h-full bg-neutral-950 grid grid-rows-[auto_minmax(0,1fr)_auto] gap-4"
>
  <Header />

  <section class="w-full px-10 flex justify-center items-center">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class="w-full max-h-full aspect-video"
      src={$recording.blobUrl}
      bind:this={videoRef}
      on:play={() => (isPlaying = true)}
      on:pause={() => (isPlaying = false)}
      on:timeupdate={() => (currentTime = videoRef.currentTime)}
    />
  </section>

  <footer class="w-full bg-neutral-900 border-t-2 border-t-white/5">
    <div
      class="h-12 px-4 border-b-2 border-b-white/5 flex justify-center items-center gap-12 relative"
    >
      <span class="tabular-nums" title={currentTime.toString(10)}>
        {secondsToTime(Math.floor(currentTime))}
      </span>
      <Controls
        {isPlaying}
        on:changeVideoState={() => {
          isPlaying ? videoRef.pause() : videoRef.play();
        }}
      />
      <span
        class="text-white/50 tabular-nums"
        title={$recording.duration.toString(10)}
      >
        {secondsToTime(Math.floor($recording.duration))}
      </span>
    </div>
    <div class="w-full h-12 px-10 border-b-2 border-b-white/5 flex items-end">
      <Timeline />
    </div>
    <div class="w-full px-10 bg-neutral-950">
      <ResizeObserver let:inlineSize>
        <div class="w-full py-6 flex flex-col gap-4 relative">
          <Seekbar time={currentTime} containerWidth={inlineSize} />
          <Trimmer />
          <Trimmer />
        </div>
      </ResizeObserver>
    </div>
  </footer>
</main>
