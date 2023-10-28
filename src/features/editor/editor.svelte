<script lang="ts">
  import Trash from "../../components/icons/trash.svg?raw";
  import Download from "../../components/icons/download.svg?raw";
  import { video } from "../../stores/video.store";

  function handleDeleteVideo() {
    video.set(null);
  }
</script>

<header
  class="h-16 mb-4 px-10 border-b border-b-white/20 bg-neutral-800 flex justify-between items-center"
>
  <button
    class="p-2 rounded-md text-neutral-300 transition-all duration-300 hover:bg-white/[0.075] hover:text-neutral-200"
    on:click={handleDeleteVideo}
  >
    <div class="w-4 aspect-square">
      {@html Trash}
    </div>
  </button>
  <h1 class="text-xl font-bold">
    <span>{$video.id}</span>
    <span class="text-neutral-500">.webm</span>
  </h1>
  <button class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2">
    <div class="w-5 aspect-square">
      {@html Download}
    </div>
    <span>Save</span>
  </button>
</header>

<section class="w-full max-w-5xl aspect-video m-auto">
  <video controls src={$video.blobUrl} />
</section>

<footer
  class="w-full h-full mt-4 py-5 px-10 border-t border-t-white/20 bg-neutral-950 flex flex-col gap-6"
>
  <div
    class="w-full h-12 bg-blue-500/30 rounded-md flex justify-between items-center overflow-hidden"
  >
    <button class="w-auto h-full px-2">
      <div class="w-1 h-1/2 bg-white/75" />
    </button>
    <button class="w-auto h-full px-2">
      <div class="w-1 h-1/2 bg-white/75" />
    </button>
  </div>
  <div
    class="w-full h-12 bg-emerald-500/30 rounded-md flex justify-between items-center overflow-hidden"
  >
    <button class="w-auto h-full px-2">
      <div class="w-1 h-1/2 bg-white/75" />
    </button>
    <button class="w-auto h-full px-2">
      <div class="w-1 h-1/2 bg-white/75" />
    </button>
  </div>
</footer>
