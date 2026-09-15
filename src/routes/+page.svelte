<script lang="ts">
	import { page } from '$app/state';
	import StoreNav from '#lib/components/home/StoreNav.svelte';
	import StoreHero from '#lib/components/home/StoreHero.svelte';
	import FeaturedSpotlight from '#lib/components/home/FeaturedSpotlight.svelte';
	import AppRow from '#lib/components/home/AppRow.svelte';
	import PlatformStory from '#lib/components/home/PlatformStory.svelte';
	import StoreCta from '#lib/components/home/StoreCta.svelte';
	import StoreFooter from '#lib/components/home/StoreFooter.svelte';
	import { getFeaturedApp, getStoreRows } from '#lib/tool/store-catalog';
	import { SITE_NAME, SITE_TAGLINE, buildSeo, siteOrigin } from '#lib/util/seo';

	const featured = getFeaturedApp();
	const rows = getStoreRows();

	const seo = $derived(
		buildSeo({
			title: SITE_NAME,
			description: `Menzies Store: ${SITE_TAGLINE}. Browse curated apps for productivity, creative work, and developers.`,
			path: '/',
			url: page.url,
			type: 'website',
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Menzies',
					url: siteOrigin(page.url),
					logo: `${siteOrigin(page.url)}/og-default.png`
				},
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: SITE_NAME,
					url: siteOrigin(page.url),
					description: `Menzies Store: ${SITE_TAGLINE}`,
					publisher: {
						'@type': 'Organization',
						name: 'Menzies'
					}
				},
				{
					'@context': 'https://schema.org',
					'@type': 'CollectionPage',
					name: SITE_NAME,
					description: `Curated software catalog from Menzies.`,
					url: `${siteOrigin(page.url)}/`
				}
			]
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

<div class="store-home">
	<StoreNav />
	<main>
		<StoreHero />
		<FeaturedSpotlight app={featured} />
		<div id="catalog" class="scroll-mt-20">
			{#each rows as row (row.id)}
				<AppRow {row} />
			{/each}
		</div>
		<PlatformStory />
		<StoreCta />
	</main>
	<StoreFooter />
</div>
