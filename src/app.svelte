<script>
  import Editor from "./features/editor/editor.svelte";
  import Recorder from "./features/recorder/recorder.svelte";
  import { video } from "./stores/video.store";
</script>

{#if $video}
  <main class="w-full h-full">
    <Editor />
  </main>
{:else}
  <main class="w-full h-full flex justify-center items-center">
    <Recorder />
  </main>
{/if}
