<script lang="ts">
  import { toBlobURL } from "@ffmpeg/util";
  import Video from "../../components/icons/video.svg?raw";
  import { ffmpeg } from "../../stores/ffmpeg.store";
  import { recording } from "../../stores/recording.store";
  import getBlobDuration from "./utils/get-blob-duration";

  let chunks = [];
  let isRecording = false;
  let stream: MediaStream;
  let recorder: MediaRecorder;

  async function startRecording() {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia();
      recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      isRecording = true;

      recorder.start();

      recorder.addEventListener("dataavailable", ({ data }) =>
        chunks.push(data)
      );
      recorder.addEventListener("stop", async () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(videoBlob);
        const duration = await getBlobDuration(url);
        recording.set({
          blobUrl: url,
          id: stream.id,
          duration,
        });
      });
      stream.getTracks().forEach((track) => {
        track.addEventListener("ended", () => stopRecording());
      });
      const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/esm";
      $ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });
      await $ffmpeg.load({
        coreURL: await toBlobURL(
          `${BASE_URL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${BASE_URL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
    } catch (error) {
      console.log(error);
    }
  }

  function stopRecording() {
    recorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    isRecording = false;
  }

  function handleClick() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
</script>

<main class="w-full h-full flex justify-center items-center">
  <button
    class="py-1 px-3 bg-purple-600 rounded-md flex items-center gap-2"
    on:click={handleClick}
  >
    <div class="w-5 aspect-square">
      {@html Video}
    </div>
    <span>{isRecording ? "Stop" : "Start"} recording</span>
  </button>
</main>
