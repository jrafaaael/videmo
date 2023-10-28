<script lang="ts">
  import { video } from "../../stores/video.store";
</script>

<section class="w-full max-w-5xl aspect-video m-auto">
  <video controls src={$video.blobUrl} />
</section>
