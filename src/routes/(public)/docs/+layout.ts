import { getNavGroups, buildSearchIndex } from '$lib/tool/docs/nav';

export const prerender = true;

export function load() {
	return {
		navGroups: getNavGroups(),
		searchIndex: buildSearchIndex()
	};
}
