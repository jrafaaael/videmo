<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Forward from "../../../components/icons/forward.svg?raw";
  import Play from "../../../components/icons/play.svg?raw";
  import Pause from "../../../components/icons/pause.svg?raw";

  export let paused: boolean;

  let dispatch = createEventDispatcher();
</script>

<div class="flex justify-center items-center gap-2">
  <button
    class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
  >
    <div class="w-5 aspect-square -scale-100">
      {@html Forward}
    </div>
  </button>
  <button
    class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
    on:click={() => dispatch("changeVideoState")}
  >
    <div class="w-5 aspect-square">
      {#if paused}
        {@html Play}
      {:else}
        {@html Pause}
      {/if}
    </div>
  </button>
  <button
    class="p-2 rounded-md text-neutral-300 transition-all hover:bg-white/[0.075] hover:text-neutral-200"
  >
    <div class="w-5 aspect-square">
      {@html Forward}
    </div>
  </button>
</div>
