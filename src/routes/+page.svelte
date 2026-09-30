<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import StoreHero from '$lib/components/home/StoreHero.svelte';
	import AppsSection from '$lib/components/home/AppsSection.svelte';
	import PlansSection from '$lib/components/home/PlansSection.svelte';
	import LibrarySection from '$lib/components/home/LibrarySection.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import {
		SITE_NAME,
		SITE_TAGLINE,
		buildSeo,
		collectionPageJsonLd,
		organizationJsonLd,
		websiteJsonLd
	} from '$lib/util/seo';

	const homeDescription = `Menzies Store: ${SITE_TAGLINE}. Discover web service plans (Medora, Loomline, Lumi Studio), desktop apps, and design libraries in one quiet catalog.`;

	const seo = $derived(
		buildSeo({
			title: SITE_NAME,
			description: homeDescription,
			path: '/',
			url: page.url,
			type: 'website',
			jsonLd: [
				organizationJsonLd(page.url),
				websiteJsonLd(homeDescription, page.url),
				collectionPageJsonLd({
					name: SITE_NAME,
					description: homeDescription,
					path: '/',
					url: page.url
				})
			]
		})
	);
</script>

<SeoHead {seo} />

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
