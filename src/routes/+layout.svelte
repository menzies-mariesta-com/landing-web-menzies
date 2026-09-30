<script lang="ts">
	import { onMount } from 'svelte';
	import { initWash } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
	// Relative path bypasses package "exports" so Vite can fingerprint + preload the same face CSS uses.
	import fraunces600Url from '../../node_modules/@menzies-mariesta-com/menzies-design-wash-ui/dist/assets/fraunces-latin-600-normal.woff2?url';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		// Do not pass defaultPigment/defaultMode: those override localStorage and wipe
		// the user's Soft Wash choice on every reload. Package falls back to mineral/light.
		initWash();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link
		rel="preload"
		href={fraunces600Url}
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="page-wash paper-grain min-h-dvh">
	{#if children}
		{@render children()}
	{/if}
</div>
