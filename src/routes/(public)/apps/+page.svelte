<script lang="ts">
	import { page } from '$app/state';
	import CatalogSearch from '$lib/components/catalog/CatalogSearch.svelte';
	import AppsCatalog from '$lib/components/home/AppsCatalog.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import { MENZIES_APPS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
	import { buildSeo } from '$lib/util/seo';

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return MENZIES_APPS;
		return MENZIES_APPS.filter((app) => {
			const hay = `${app.name} ${app.kind} ${app.tagline} ${app.description}`.toLowerCase();
			return hay.includes(q);
		});
	});

	const seo = $derived(
		buildSeo({
			title: m.apps_page_title(),
			description: m.apps_seo_description(),
			path: '/apps',
			url: page.url,
			type: 'website'
		})
	);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
	<meta property="og:url" content={seo.ogUrl} />
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:image" content={seo.ogImage} />
	<meta property="og:site_name" content={seo.ogSiteName} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.twitterImage} />
	<meta name="twitter:title" content={seo.ogTitle} />
	<meta name="twitter:description" content={seo.ogDescription} />
	{#if seo.robots}
		<meta name="robots" content={seo.robots} />
	{/if}
	{@html `<script type="application/ld+json">${seo.jsonLd}</script>`}
</svelte:head>

<div class="store-apps">
	<StoreNav />
	<main class="px-4 py-12 sm:px-6 sm:py-16">
		<div class="mx-auto max-w-6xl">
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
			>
				<h1 class="font-display shrink-0 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
					{m.apps_page_title()}
				</h1>
				<div class="flex w-full sm:max-w-md sm:flex-1 sm:justify-end md:max-w-xl">
					<CatalogSearch
						bind:value={query}
						placeholder={m.catalog_search_placeholder()}
						label={m.catalog_search_label()}
					/>
				</div>
			</div>

			<AppsCatalog apps={filtered} emptyMessage={m.catalog_search_empty()} />
		</div>
	</main>
	<StoreFooter />
</div>
