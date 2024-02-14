<script lang="ts">
	import RecordingList from './components/recording-list.svelte';
	import FloatingRecordingBar from './components/floating-recording-bar.svelte';
</script>

<main
	class="w-full h-full p-8 pb-32 grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] auto-rows-min gap-8 md:p-16 md:pb-32 lg:px-32 lg:gap-y-16"
>
	<RecordingList />
	<FloatingRecordingBar />
</main>
