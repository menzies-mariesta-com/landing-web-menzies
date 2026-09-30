<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/error/ErrorPage.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { resolveErrorKind, type ErrorKind } from '$lib/tool/error-page';
	import { m } from '$lib/paraglide/messages';
	import { buildSeo } from '$lib/util/seo';

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

<SeoHead {seo} />

<ErrorPage {status} {detail} />
