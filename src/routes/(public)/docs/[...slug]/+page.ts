import { error } from '@sveltejs/kit';
import {
	getAdjacentDocs,
	getAllDocs,
	getDocBySlug,
	folderTitle,
	getTreeLabel
} from '$lib/tool/docs/nav';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

/** Slugs of pages plus every folder above them, so `/docs/medora/billing` resolves. */
function allSlugs(): string[] {
	const slugs = new Set<string>();
	for (const doc of getAllDocs()) {
		slugs.add(doc.slug);
		const parts = doc.slug.split('/');
		for (let i = 2; i < parts.length; i += 1) {
			slugs.add(parts.slice(0, i).join('/'));
		}
	}
	return [...slugs];
}

export const entries: EntryGenerator = () => allSlugs().map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const slug = params.slug;
	const doc = getDocBySlug(slug);

	if (!doc) {
		// A folder: list the pages inside it rather than 404, so sidebar group
		// links and hand-typed URLs both land somewhere useful.
		const pages = getAllDocs().filter((d) => d.slug.startsWith(`${slug}/`));
		if (pages.length === 0) error(404, `Documentation page not found: ${slug}`);
		return {
			slug,
			doc: null,
			folder: {
				title: folderTitle(slug),
				pages: pages.map(({ title, href, description }) => ({ title, href, description }))
			},
			sectionLabel: pages[0] ? getTreeLabel(pages[0].tree) : '',
			prev: null,
			next: null
		};
	}

	const { prev, next } = getAdjacentDocs(slug);

	return {
		slug,
		doc,
		folder: null,
		sectionLabel: getTreeLabel(doc.tree),
		prev,
		next
	};
};
