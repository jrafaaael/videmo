<script lang="ts">
  import { fetchFile } from "@ffmpeg/util";
  import Trash from "../../../components/icons/trash.svg?raw";
  import Download from "../../../components/icons/download.svg?raw";
  import { recording } from "../../../stores/recording.store";
  import { ffmpeg } from "../../../stores/ffmpeg.store";
  import { edits } from "../stores/edits.store";

  async function process() {
    console.log("here");
    try {
      await $ffmpeg.writeFile("input.webm", await fetchFile($recording.url));
      await $ffmpeg.exec([
        "-ss",
        $edits.startAt.toString(10),
        "-to",
        $edits.endAt.toString(10),
        "-i",
        "input.webm",
        "-c",
        "copy",
        "-copyts",
        $recording.id + ".webm",
      ]);
      const video = await $ffmpeg.readFile($recording.id + ".webm");
      const downloadElement = document.createElement("a");
      const url = URL.createObjectURL(new Blob([video], { type: "video/webm" }));
      downloadElement.href = url;
      downloadElement.download = $recording.id + ".webm";
      downloadElement.click();
      URL.revokeObjectURL(url);
      console.log("here2");
    } catch (e) {
      console.log(e);
    }
  }
</script>

<header
  class="h-16 px-10 bg-neutral-800 border-b-2 border-b-white/5 shrink-0 flex justify-between items-center gap-8"
>
  <a
    class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
    href="/"
    data-astro-reload
  >
    <div class="w-4 aspect-square">
      {@html Trash}
    </div>
  </a>
  <h1 class="text-xl font-bold flex">
    <span class="line-clamp-1 break-all grow shrink-0 basis-0">
      {$recording.id}
    </span>
    <span class="text-neutral-500 grow-0 shrink basis-1">.webm</span>
  </h1>
  <button
    class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2"
    on:click={process}
  >
    <div class="w-5 aspect-square">
      {@html Download}
    </div>
    <span>Save</span>
  </button>
</header>
