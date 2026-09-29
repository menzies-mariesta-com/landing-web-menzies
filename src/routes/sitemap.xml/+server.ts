import type { RequestHandler } from './$types';
import { siteOrigin } from '$lib/util/seo';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const origin = siteOrigin(url);
	const urls: { loc: string; priority: string; changefreq: string }[] = [
		{ loc: `${origin}/`, priority: '1.0', changefreq: 'weekly' },
		{ loc: `${origin}/plans`, priority: '0.9', changefreq: 'weekly' },
		{ loc: `${origin}/apps`, priority: '0.9', changefreq: 'weekly' },
		{ loc: `${origin}/library`, priority: '0.9', changefreq: 'weekly' },
		{ loc: `${origin}/branding`, priority: '0.7', changefreq: 'monthly' }
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
