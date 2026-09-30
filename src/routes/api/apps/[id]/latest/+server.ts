import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { nativeFetch } from '$lib/server/native-fetch';
import { fetchLatestJson } from '$lib/tool/app-releases';
import { MENZIES_APPS } from '$lib/tool/store-catalog';

/** Dynamic: server-fetches GitHub latest.json (avoids browser CORS). */
export const prerender = false;

const UA = 'MenziesLanding/1.0 (+https://store.menzies.design)';

export const GET: RequestHandler = async ({ params, setHeaders }) => {
	const app = MENZIES_APPS.find((entry) => entry.id === params.id);
	if (!app) {
		error(404, 'Unknown app');
	}

	try {
		// Use nativeFetch so concurrent page SSR's DEV fetch patch cannot warn.
		const manifest = await fetchLatestJson(app.latestJsonUrl, {
			fetch: nativeFetch,
			timeoutMs: 15000,
			headers: {
				Accept: 'application/json',
				'User-Agent': UA
			}
		});

		setHeaders({
			'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
			'Netlify-CDN-Cache-Control':
				'public, durable, s-maxage=300, stale-while-revalidate=600'
		});

		return json(manifest);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Failed to load release manifest';
		error(502, message);
	}
};
