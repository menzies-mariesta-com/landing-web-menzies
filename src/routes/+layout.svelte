<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { onMount, onDestroy } from 'svelte';
	import { locales, localizeHref } from '#lib/paraglide/runtime';
	import {
		initWash,
		type WashRuntime
	} from '@menzies-mariesta-com/menzies-design-wash-ui/core';
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';

	let { children } = $props();

	let wash: WashRuntime | undefined;

	onMount(() => {
		wash = initWash({ defaultPigment: 'mineral', defaultMode: 'light' });
	});

	onDestroy(() => {
		wash?.destroy();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<div class="page-wash paper-grain min-h-dvh">
	{@render children()}
</div>

<div style="display: none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>
