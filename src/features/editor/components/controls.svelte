<script lang="ts">
  import Timeline from "./timeline.svelte";
</script>

<footer class="w-full h-full mt-4 bg-neutral-900 border-t-2 border-t-white/5">
  <Timeline />
  <div class="w-full h-full py-5 px-10 bg-neutral-950 flex flex-col gap-5">
    <div
      class="w-full h-12 bg-blue-500/30 rounded-md flex justify-between items-center overflow-hidden"
    >
      <button class="w-auto h-full px-2">
        <div class="w-1 h-1/2 bg-white/50 rounded-full" />
      </button>
      <button class="w-auto h-full px-2">
        <div class="w-1 h-1/2 bg-white/50 rounded-full" />
      </button>
    </div>
    <div
      class="w-full h-12 bg-emerald-500/30 rounded-md flex justify-between items-center overflow-hidden"
    >
      <button class="w-auto h-full px-2">
        <div class="w-1 h-1/2 bg-white/50 rounded-full" />
      </button>
      <button class="w-auto h-full px-2">
        <div class="w-1 h-1/2 bg-white/50 rounded-full" />
      </button>
    </div>
  </div>
</footer>
