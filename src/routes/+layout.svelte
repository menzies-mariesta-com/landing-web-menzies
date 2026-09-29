<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { initWash } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
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
</svelte:head>

<div class="page-wash paper-grain min-h-dvh">
	{#if children}
		{@render children()}
	{/if}
</div>

<div style="display: none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>
