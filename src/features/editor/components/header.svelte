<script lang="ts">
  import Trash from "../../../components/icons/trash.svg?raw";
  import Download from "../../../components/icons/download.svg?raw";
  import { recording } from "../../../stores/recording.store";

  function handleRetry() {
    const blobUrl = $recording.blobUrl;
    URL.revokeObjectURL(blobUrl);
    recording.set(null);
  }
</script>

<header
  class="h-16 px-10 bg-neutral-800 border-b-2 border-b-white/5 shrink-0 flex justify-between items-center"
>
  <button
    class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
    on:click={handleRetry}
  >
    <div class="w-4 aspect-square">
      {@html Trash}
    </div>
  </button>
  <h1 class="text-xl font-bold">
    <span>{$recording.id}</span>
    <span class="text-neutral-500">.webm</span>
  </h1>
  <a
    class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2"
    href={$recording.blobUrl}
    download={$recording.id}
  >
    <div class="w-5 aspect-square">
      {@html Download}
    </div>
    <span>Save</span>
  </a>
</header>
