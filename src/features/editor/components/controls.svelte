<script lang="ts">
  import Forward from "../../../components/icons/forward.svg?raw";
  import Play from "../../../components/icons/play.svg?raw";
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
  >
    <div class="w-5 aspect-square">
      {@html Play}
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
