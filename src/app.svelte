<script>
  import Editor from "./features/editor/editor.svelte";
  import Recorder from "./features/recorder/recorder.svelte";
  import { video } from "./stores/video.store";
</script>

{#if $video}
  <Editor />
{:else}
  <Recorder />
{/if}
