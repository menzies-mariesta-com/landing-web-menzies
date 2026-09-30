import { ORIGIN } from '$app/env/public';

export const SITE_NAME = 'Menzies Store';
export const SITE_TAGLINE = 'Software worth opening';
/** Public contact address for mailto: chrome (nav, footer). */
export const CONTACT_EMAIL = 'zarnihlawn@outlook.com';
export const DEFAULT_DESCRIPTION =
	'Menzies Store: software worth opening. Discover web service plans (Medora, Loomline, Lumi Studio), desktop apps, and design libraries in one quiet catalog.';
/** Default Open Graph / Twitter share image (1200x630, kept under ~50KB). */
export const DEFAULT_OG_IMAGE_PATH = '/og-default.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
/** Canonical production origin for absolute SEO URLs. */
export const PRODUCTION_ORIGIN = 'https://store.menzies.design';

/** True when an origin is safe to emit in canonical / OG tags. */
export function isIndexableOrigin(origin: string): boolean {
	try {
		const url = new URL(origin);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
		const host = url.hostname.toLowerCase();
		if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return false;
		if (host.includes('sveltekit-prerender')) return false;
		return true;
	} catch {
		return false;
	}
}

/**
 * Absolute site origin for canonical, OG, JSON-LD, and sitemap.
 * Prefers a real request / configured origin; falls back to production
 * so prerender / localhost never ship broken canonicals.
 */
export function siteOrigin(url?: Pick<URL, 'origin'>): string {
	const fromUrl = url?.origin;
	if (fromUrl && isIndexableOrigin(fromUrl)) return fromUrl.replace(/\/$/, '');

	const fromEnv = typeof ORIGIN === 'string' ? ORIGIN.replace(/\/$/, '') : '';
	if (fromEnv && isIndexableOrigin(fromEnv)) return fromEnv;

	return PRODUCTION_ORIGIN;
}

export type SeoInput = {
	title: string;
	description?: string;
	path?: string;
	/** Accepts `page.url` from `$app/state` (readonly searchParams). */
	url?: Pick<URL, 'origin' | 'pathname'>;
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
	ogImageWidth: string;
	ogImageHeight: string;
	ogSiteName: string;
	twitterCard: string;
	twitterImage: string;
	robots?: string;
	jsonLd: string;
};

export type BreadcrumbItem = {
	name: string;
	path: string;
};

export function absoluteUrl(path: string, url?: Pick<URL, 'origin'>): string {
	const origin = siteOrigin(url);
	const normalized = path.startsWith('/') ? path : `/${path}`;
	return `${origin}${normalized === '/' ? '/' : normalized.replace(/\/$/, '') || '/'}`;
}

export function organizationJsonLd(url?: Pick<URL, 'origin'>): Record<string, unknown> {
	const origin = siteOrigin(url);
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Menzies',
		url: origin,
		logo: `${origin}/logo.svg`,
		parentOrganization: {
			'@type': 'Organization',
			name: 'Mariesta'
		}
	};
}

export function websiteJsonLd(
	description: string,
	url?: Pick<URL, 'origin'>
): Record<string, unknown> {
	const origin = siteOrigin(url);
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: origin,
		description,
		publisher: {
			'@type': 'Organization',
			name: 'Menzies'
		}
	};
}

export function collectionPageJsonLd(input: {
	name: string;
	description: string;
	path: string;
	url?: Pick<URL, 'origin'>;
}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: input.name,
		description: input.description,
		url: absoluteUrl(input.path, input.url),
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: siteOrigin(input.url)
		}
	};
}

export function webPageJsonLd(input: {
	name: string;
	description: string;
	path: string;
	url?: Pick<URL, 'origin'>;
}): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: input.name,
		description: input.description,
		url: absoluteUrl(input.path, input.url),
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: siteOrigin(input.url)
		}
	};
}

export function breadcrumbJsonLd(
	items: BreadcrumbItem[],
	url?: Pick<URL, 'origin'>
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path, url)
		}))
	};
}

export function buildSeo(input: SeoInput): SeoTags {
	const description = input.description?.trim() || DEFAULT_DESCRIPTION;
	const origin = siteOrigin(input.url);
	const path = input.path ?? input.url?.pathname ?? '/';
	const canonicalPath = path === '/' ? '/' : path.replace(/\/$/, '') || '/';
	const canonical = `${origin}${canonicalPath === '/' ? '/' : canonicalPath}`;
	const ogImage = input.image?.startsWith('http')
		? input.image
		: `${origin}${input.image ?? DEFAULT_OG_IMAGE_PATH}`;
	const title =
		input.title === SITE_NAME
			? `${SITE_NAME}: ${SITE_TAGLINE}`
			: `${input.title} | ${SITE_NAME}`;

	const defaultLd = webPageJsonLd({
		name: input.title,
		description,
		path: canonicalPath,
		url: input.url
	});

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
		ogImageWidth: String(OG_IMAGE_WIDTH),
		ogImageHeight: String(OG_IMAGE_HEIGHT),
		ogSiteName: SITE_NAME,
		twitterCard: 'summary_large_image',
		twitterImage: ogImage,
		robots: input.noindex ? 'noindex, nofollow' : undefined,
		jsonLd: JSON.stringify(jsonLd)
	};
}
