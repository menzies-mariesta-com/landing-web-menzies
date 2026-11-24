import type {
	DocFrontmatter,
	DocNavGroup,
	DocNavItem,
	DocNavNode,
	DocTree,
	SearchEntry
} from './types';
import { FOLDER_LABELS, FOLDER_ORDER } from './folder-labels';

type DocModule = {
	default: unknown;
	metadata?: Partial<DocFrontmatter>;
};

export const DOC_TREES: DocTree[] = ['getting-started', 'medora', 'nextup'];

const TREE_LABELS: Record<DocTree, string> = {
	'getting-started': 'Getting started',
	medora: 'Medora',
	nextup: 'NextUp'
};

const modules = import.meta.glob<DocModule>('../../../content/docs/**/*.{md,svx}', {
	eager: true
});

/**
 * Display label for a folder in the sidebar, keyed by its posix path relative
 * to `content/docs`. Written by `scripts/move-medora-docs.mjs`; an unlabelled
 * folder falls back to its last segment, title-cased.
 */
const folderLabels: Record<string, string> = FOLDER_LABELS;

function titleize(segment: string): string {
	const spaced = segment.replace(/[-_]+/g, ' ').trim();
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** `…/content/docs/medora/billing/ip-billing.md` → `medora/billing/ip-billing`. */
function slugFromPath(path: string): string {
	return path
		.replace(/^.*\/content\/docs\//, '')
		.replace(/\.(md|svx)$/, '')
		.replace(/\/index$/, '');
}

function toItem(path: string, mod: DocModule): DocNavItem | null {
	const meta = mod.metadata;
	if (!meta?.title || !meta.description || meta.section == null || meta.order == null) return null;
	const slug = slugFromPath(path);
	const [tree] = slug.split('/');
	if (!tree || !DOC_TREES.includes(tree as DocTree)) return null;
	return {
		title: meta.title,
		description: meta.description,
		section: String(meta.section),
		order: meta.order,
		tree: tree as DocTree,
		slug,
		href: `/docs/${slug}`
	};
}

/** Every doc page, sorted by tree, then nav path, then explicit order. */
export function getAllDocs(): DocNavItem[] {
	const items: DocNavItem[] = [];
	for (const [path, mod] of Object.entries(modules)) {
		const item = toItem(path, mod as DocModule);
		if (item) items.push(item);
	}
	return items.sort(compareItems);
}

function compareItems(a: DocNavItem, b: DocNavItem): number {
	const ti = DOC_TREES.indexOf(a.tree) - DOC_TREES.indexOf(b.tree);
	if (ti !== 0) return ti;
	const pa = a.slug.split('/').slice(0, -1).join('/');
	const pb = b.slug.split('/').slice(0, -1).join('/');
	if (pa !== pb) return pa.localeCompare(pb);
	return a.order - b.order || a.title.localeCompare(b.title);
}

type PendingFolder = { path: string; children: (DocNavItem | PendingFolder)[] };

/**
 * Nest a tree into folders. A doc's folders come from its path; a flat folder
 * (pages sitting directly in the tree) is grouped by `section` instead, so a
 * section label never duplicates its own folder name.
 */
function buildTree(tree: DocTree, docs: DocNavItem[]): DocNavNode[] {
	const root: PendingFolder = { path: tree, children: [] };

	// A section is only needed where pages sit directly in a folder.
	const flatSections = new Map<string, Set<string>>();
	for (const doc of docs) {
		const folder = doc.slug.split('/').slice(0, -1).join('/');
		if (!flatSections.has(folder)) flatSections.set(folder, new Set());
		flatSections.get(folder)?.add(doc.section);
	}

	for (const doc of docs) {
		const folders = doc.slug.split('/').slice(1, -1);
		const folder = doc.slug.split('/').slice(0, -1).join('/');
		const sectionGroups = (flatSections.get(folder)?.size ?? 0) > 1;
		if (sectionGroups) folders.push(...sectionSlug(doc.section));
		let cursor = root;
		for (const segment of folders) {
			const path = `${cursor.path}/${segment}`;
			let next = cursor.children.find(
				(child): child is PendingFolder => 'children' in child && child.path === path
			);
			if (!next) {
				next = { path, children: [] };
				cursor.children.push(next);
			}
			cursor = next;
		}
		cursor.children.push(doc);
	}

	return root.children.map(toNode).sort(compareNodes);
}

/** `'Team and config'` → `'team-and-config'`; empty section stays flat. */
function sectionSlug(section: string): string[] {
	const slug = section
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return slug ? [slug] : [];
}

function toNode(entry: DocNavItem | PendingFolder): DocNavNode {
	if (!('children' in entry)) {
		return { id: entry.slug, title: entry.title, href: entry.href, children: [] };
	}
	const children = entry.children.map(toNode).sort(compareNodes);
	const label = folderLabels[entry.path] ?? titleize(entry.path.split('/').pop() ?? '');
	return { id: entry.path, title: label, href: null, children };
}

/** Folders before pages; inside a kind, by explicit order then title. */
function compareNodes(a: DocNavNode, b: DocNavNode): number {
	const af = a.href === null ? 0 : 1;
	const bf = b.href === null ? 0 : 1;
	if (af !== bf) return af - bf;
	if (af === 0) {
		const ai = FOLDER_ORDER[a.id];
		const bi = FOLDER_ORDER[b.id];
		if (ai !== undefined && bi !== undefined && ai !== bi) return ai - bi;
	}
	return a.title.localeCompare(b.title);
}

export function getNavGroups(): DocNavGroup[] {
	const docs = getAllDocs();
	return DOC_TREES.map((tree) => ({
		id: tree,
		label: TREE_LABELS[tree],
		nodes: buildTree(
			tree,
			docs.filter((d) => d.tree === tree)
		)
	}));
}

export function getTreeLabel(tree: DocTree): string {
	return TREE_LABELS[tree];
}

/** Human label for a folder path, falling back to its last segment. */
export function folderTitle(slug: string): string {
	return folderLabels[slug] ?? titleize(slug.split('/').pop() ?? slug);
}

export function getDocBySlug(slug: string): DocNavItem | undefined {
	return getAllDocs().find((d) => d.slug === slug);
}

export function getDocModule(slug: string): DocModule | undefined {
	const entry = Object.entries(modules).find(([path]) => slugFromPath(path) === slug);
	return entry ? (entry[1] as DocModule) : undefined;
}

export function getAdjacentDocs(slug: string): {
	prev: DocNavItem | null;
	next: DocNavItem | null;
} {
	const docs = getAllDocs();
	const index = docs.findIndex((d) => d.slug === slug);
	if (index < 0) return { prev: null, next: null };
	return {
		prev: index > 0 ? (docs[index - 1] ?? null) : null,
		next: index < docs.length - 1 ? (docs[index + 1] ?? null) : null
	};
}

export function buildSearchIndex(): SearchEntry[] {
	return getAllDocs().map((doc) => ({
		slug: doc.slug,
		href: doc.href,
		title: doc.title,
		description: doc.description,
		tree: doc.tree,
		section: doc.section,
		headings: []
	}));
}
