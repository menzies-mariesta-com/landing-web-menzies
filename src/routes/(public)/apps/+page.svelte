<script lang="ts">
	import { page } from '$app/state';
	import CatalogSearch from '$lib/components/catalog/CatalogSearch.svelte';
	import AppsCatalog from '$lib/components/home/AppsCatalog.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import { MENZIES_APPS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
	import {
		breadcrumbJsonLd,
		buildSeo,
		collectionPageJsonLd
	} from '$lib/util/seo';

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
			title: m.apps_seo_title(),
			description: m.apps_seo_description(),
			path: '/apps',
			url: page.url,
			type: 'website',
			jsonLd: [
				collectionPageJsonLd({
					name: m.apps_page_title(),
					description: m.apps_seo_description(),
					path: '/apps',
					url: page.url
				}),
				breadcrumbJsonLd(
					[
						{ name: 'Home', path: '/' },
						{ name: m.apps_page_title(), path: '/apps' }
					],
					page.url
				)
			]
		})
	);
</script>

<SeoHead {seo} />

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
