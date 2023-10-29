<script>
  import Editor from "./features/editor/editor.svelte";
  import Recorder from "./features/recorder/recorder.svelte";
  import { recording } from "./stores/recording.store";
</script>

{#if $recording}
  <Editor />
{:else}
  <Recorder />
{/if}
