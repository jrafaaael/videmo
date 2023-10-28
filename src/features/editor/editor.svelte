<script lang="ts">
  import Trash from "../../components/icons/trash.svg?raw";
  import Download from "../../components/icons/download.svg?raw";
  import { video } from "../../stores/video.store";

  function handleDeleteVideo() {
    video.set(null);
  }
</script>

<header
  class="h-16 mb-4 px-10 bg-neutral-900 flex justify-between items-center"
>
  <button
    class="p-2 bg-white/5 border border-white/10 rounded-md hover:bg-white/10"
    on:click={handleDeleteVideo}
  >
    <div class="w-5 aspect-square">
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
