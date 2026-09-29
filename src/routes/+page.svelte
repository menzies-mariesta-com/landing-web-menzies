<script lang="ts">
	import { page } from '$app/state';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import StoreHero from '$lib/components/home/StoreHero.svelte';
	import AppsSection from '$lib/components/home/AppsSection.svelte';
	import PlansSection from '$lib/components/home/PlansSection.svelte';
	import LibrarySection from '$lib/components/home/LibrarySection.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import { SITE_NAME, SITE_TAGLINE, buildSeo, siteOrigin } from '$lib/util/seo';

	const seo = $derived(
		buildSeo({
			title: SITE_NAME,
			description: `Menzies: ${SITE_TAGLINE}. Web service plans (Medora, Loomline, Lumi Studio), apps, and libraries.`,
			path: '/',
			url: page.url,
			type: 'website',
			jsonLd: [
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Menzies',
					url: siteOrigin(page.url),
					logo: `${siteOrigin(page.url)}/logo.svg`
				},
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: SITE_NAME,
					url: siteOrigin(page.url),
					description: `Menzies: ${SITE_TAGLINE}. Web service plans, apps, and libraries.`,
					publisher: {
						'@type': 'Organization',
						name: 'Menzies'
					}
				},
				{
					'@context': 'https://schema.org',
					'@type': 'CollectionPage',
					name: SITE_NAME,
					description: 'Menzies web service plans, apps, and libraries.',
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
		<PlansSection />
		<AppsSection />
		<LibrarySection />
	</main>
	<StoreFooter />
</div>
