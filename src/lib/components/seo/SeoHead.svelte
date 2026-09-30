<script lang="ts">
	import type { SeoTags } from '$lib/util/seo';

	type Props = {
		seo: SeoTags;
	};

	let { seo }: Props = $props();
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
	<meta property="og:image:width" content={seo.ogImageWidth} />
	<meta property="og:image:height" content={seo.ogImageHeight} />
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
