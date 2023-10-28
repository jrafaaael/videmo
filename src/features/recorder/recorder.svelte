<script lang="ts">
  import { video } from "../../stores/video.store";
  import Video from "../../components/icons/video.svg?raw";

  let chunks = [];
  let isRecording = false;
  let stream: MediaStream;
  let recorder: MediaRecorder;

  async function startRecording() {
    try {
      stream = await navigator.mediaDevices.getDisplayMedia();
      recorder = new MediaRecorder(stream);
      isRecording = true;

      recorder.start();

      recorder.addEventListener("dataavailable", ({ data }) =>
        chunks.push(data)
      );
      recorder.addEventListener("stop", () => {
        const videoBlob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(videoBlob);
        video.set({ blobUrl: url, id: stream.id });
      });
      stream.getTracks().forEach((track) => {
        track.addEventListener("ended", () => stopRecording());
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
