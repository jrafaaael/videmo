<script>
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';
	import '$lib/styles/global.css';
	import '$lib/styles/tailwind.css';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<title>Videmo</title>
</svelte:head>
<slot />
