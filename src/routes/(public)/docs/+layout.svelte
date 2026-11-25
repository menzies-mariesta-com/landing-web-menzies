<script lang="ts">
	import DocsSidebar from '$lib/components/docs/DocsSidebar.svelte';
	import DocsSearch from '$lib/components/docs/DocsSearch.svelte';
	import SiteHeader from '$lib/components/docs/SiteHeader.svelte';
	import BrandMark from '$lib/components/docs/BrandMark.svelte';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';

	let { data, children } = $props();

	let searchOpen = $state(false);
	let drawerOpen = $state(false);

	const currentSlug = $derived(
		page.url.pathname.replace(/^\/docs\/?/, '').replace(/\/$/, '') || 'getting-started'
	);

	$effect(() => {
		page.url.pathname;
		drawerOpen = false;
	});
</script>

<DocsSearch entries={data.searchIndex} bind:open={searchOpen} />

<!-- WashShell-style drawer: sidebar chrome + main header share the same top row on lg -->
<div class="drawer lg:drawer-open">
	<input id="docs-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

	<div class="drawer-content flex min-h-dvh flex-col">
		<SiteHeader shell onSearch={() => (searchOpen = true)} onMenu={() => (drawerOpen = true)} />
		<div class="min-w-0 flex-1">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>

	<div class="drawer-side z-40">
		<label for="docs-drawer" class="drawer-overlay cursor-pointer" aria-label={m.docs_search_close()}
		></label>
		<aside
			class="border-ink-border bg-base-100 paper-grain flex min-h-full w-[280px] flex-col border-r"
		>
			<div class="app-chrome-bar border-ink-border/80 h-14 border-b px-5">
				<a href="/" class="flex min-w-0 cursor-pointer flex-row items-center gap-2.5">
					<BrandMark size="md" />
					<span
						class="font-display truncate text-xl font-semibold tracking-tight lg:text-2xl"
					>
						{m.brand_menzies()}
					</span>
				</a>
			</div>
			<ul class="menu w-full flex-1 gap-1 overflow-y-auto scroll-smooth px-4 py-4">
				<DocsSidebar groups={data.navGroups} {currentSlug} />
			</ul>
		</aside>
	</div>
</div>
