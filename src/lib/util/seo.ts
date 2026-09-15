export const SITE_NAME = 'Menzies Store';
export const SITE_TAGLINE = 'Software worth opening';
export const DEFAULT_DESCRIPTION =
	'Menzies Store: discover polished apps for work and craft. Browse editors\' picks, productivity, and creative tools from the Menzies catalog.';

/** Absolute site origin. Prefer the request URL; fall back for prerender tooling. */
export function siteOrigin(url?: URL): string {
	if (url) return url.origin;
	return 'https://store.menzies.design';
}

export type SeoInput = {
	title: string;
	description?: string;
	path?: string;
	url?: URL;
	type?: 'website' | 'article';
	image?: string;
	noindex?: boolean;
	jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export type SeoTags = {
	title: string;
	description: string;
	canonical: string;
	ogTitle: string;
	ogDescription: string;
	ogUrl: string;
	ogType: string;
	ogImage: string;
	ogSiteName: string;
	twitterCard: string;
	twitterImage: string;
	robots?: string;
	jsonLd: string;
};

export function buildSeo(input: SeoInput): SeoTags {
	const description = input.description?.trim() || DEFAULT_DESCRIPTION;
	const origin = siteOrigin(input.url);
	const path = input.path ?? input.url?.pathname ?? '/';
	const canonical = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
	const ogImage = input.image?.startsWith('http')
		? input.image
		: `${origin}${input.image ?? '/og-default.png'}`;
	const title =
		input.title === SITE_NAME
			? `${SITE_NAME}: ${SITE_TAGLINE}`
			: `${input.title} | ${SITE_NAME}`;

	const defaultLd = {
		'@context': 'https://schema.org',
		'@type': input.type === 'article' ? 'Article' : 'WebPage',
		name: input.title,
		description,
		url: canonical,
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: origin
		}
	};

	const jsonLd = input.jsonLd ?? defaultLd;

	return {
		title,
		description,
		canonical,
		ogTitle: title,
		ogDescription: description,
		ogUrl: canonical,
		ogType: input.type ?? 'website',
		ogImage,
		ogSiteName: SITE_NAME,
		twitterCard: 'summary_large_image',
		twitterImage: ogImage,
		robots: input.noindex ? 'noindex, nofollow' : undefined,
		jsonLd: JSON.stringify(jsonLd)
	};
}
