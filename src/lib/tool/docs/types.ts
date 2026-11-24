/** Top-level docs collections. Each one is its own sidebar group. */
export type DocTree = 'getting-started' | 'medora' | 'nextup';

/**
 * Frontmatter every doc page carries. `section` is the nav label the page sits
 * under inside its tree; `order` sorts siblings.
 */
export type DocFrontmatter = {
	title: string;
	description: string;
	section: string;
	order: number;
};

export type DocNavItem = DocFrontmatter & {
	tree: DocTree;
	/** Path within the tree, e.g. `billing/ip-billing`. */
	slug: string;
	href: string;
};

/** A sidebar entry: a leaf page, or a folder that holds more entries. */
export type DocNavNode = {
	/** Stable id for keyed rendering. */
	id: string;
	title: string;
	/** Null for a folder that only groups children. */
	href: string | null;
	children: DocNavNode[];
};

export type DocNavGroup = {
	id: DocTree;
	label: string;
	/** Folder roots, each already nested to its full depth. */
	nodes: DocNavNode[];
};

export type SearchEntry = {
	slug: string;
	href: string;
	title: string;
	description: string;
	tree: DocTree;
	section: string;
	headings: string[];
};

export type TocItem = {
	id: string;
	text: string;
	level: 2 | 3;
};
