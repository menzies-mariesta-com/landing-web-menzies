<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/error/ErrorPage.svelte';
	import { resolveErrorKind, type ErrorKind } from '$lib/tool/error-page';
	import { m } from '$lib/paraglide/messages';
	import { SITE_NAME, buildSeo } from '$lib/util/seo';

	const status = $derived(page.status);
	const detail = $derived(page.error?.message ?? null);
	const kind = $derived(resolveErrorKind(status));

	const title = $derived.by(() => {
		const map: Record<ErrorKind, string> = {
			401: m.error_401_title(),
			403: m.error_403_title(),
			404: m.error_404_title(),
			500: m.error_500_title(),
			502: m.error_502_title(),
			503: m.error_503_title(),
			fallback: m.error_fallback_title()
		};
		return map[kind];
	});

	const seo = $derived(
		buildSeo({
			title,
			description: m.error_seo_description({ status: String(status) }),
			path: page.url.pathname,
			url: page.url,
			type: 'website',
			noindex: true
		})
	);
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<meta name="robots" content="noindex, nofollow" />
	<meta property="og:title" content={seo.ogTitle} />
	<meta property="og:description" content={seo.ogDescription} />
	<meta property="og:url" content={seo.ogUrl} />
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:image" content={seo.ogImage} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:image" content={seo.twitterImage} />
</svelte:head>

<ErrorPage {status} {detail} />
