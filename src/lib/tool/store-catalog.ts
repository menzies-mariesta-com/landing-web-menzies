export type StoreCategoryId =
	| 'editors-picks'
	| 'productivity'
	| 'creative'
	| 'developer'
	| 'utilities';

export type StoreApp = {
	id: string;
	name: string;
	category: StoreCategoryId;
	categoryLabel: string;
	rating: number;
	tagline: string;
	/** Tailwind-friendly accent token for tile mark */
	accent: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning';
	/** Single letter / short mark shown in the app icon tile */
	mark: string;
	featured?: boolean;
	featuredBlurb?: string;
};

export type StoreRow = {
	id: string;
	title: string;
	subtitle: string;
	apps: StoreApp[];
};

export const STORE_CATEGORIES: { id: StoreCategoryId; label: string }[] = [
	{ id: 'editors-picks', label: "Editors' picks" },
	{ id: 'productivity', label: 'Productivity' },
	{ id: 'creative', label: 'Creative' },
	{ id: 'developer', label: 'Developer' },
	{ id: 'utilities', label: 'Utilities' }
];

export const STORE_APPS: StoreApp[] = [
	{
		id: 'northline',
		name: 'Northline',
		category: 'editors-picks',
		categoryLabel: 'Productivity',
		rating: 4.9,
		tagline: 'Calm project boards for focused teams.',
		accent: 'primary',
		mark: 'N',
		featured: true,
		featuredBlurb:
			'Today’s spotlight: a workspace that stays out of the way so shipping stays front of mind.'
	},
	{
		id: 'lumen-notes',
		name: 'Lumen Notes',
		category: 'editors-picks',
		categoryLabel: 'Productivity',
		rating: 4.8,
		tagline: 'Capture ideas with ink-clean structure.',
		accent: 'secondary',
		mark: 'L'
	},
	{
		id: 'harbor',
		name: 'Harbor',
		category: 'editors-picks',
		categoryLabel: 'Utilities',
		rating: 4.7,
		tagline: 'Secure vaults with a paper-quiet UI.',
		accent: 'info',
		mark: 'H'
	},
	{
		id: 'pulse-desk',
		name: 'Pulse Desk',
		category: 'productivity',
		categoryLabel: 'Productivity',
		rating: 4.6,
		tagline: 'Ops dashboards without the noise.',
		accent: 'primary',
		mark: 'P'
	},
	{
		id: 'folio',
		name: 'Folio',
		category: 'productivity',
		categoryLabel: 'Productivity',
		rating: 4.5,
		tagline: 'Documents that feel like print.',
		accent: 'accent',
		mark: 'F'
	},
	{
		id: 'relay',
		name: 'Relay',
		category: 'productivity',
		categoryLabel: 'Productivity',
		rating: 4.4,
		tagline: 'Async updates that stay readable.',
		accent: 'secondary',
		mark: 'R'
	},
	{
		id: 'canvas-ink',
		name: 'Canvas Ink',
		category: 'creative',
		categoryLabel: 'Creative',
		rating: 4.8,
		tagline: 'Illustration with wash-aware brushes.',
		accent: 'accent',
		mark: 'C'
	},
	{
		id: 'reelcraft',
		name: 'Reelcraft',
		category: 'creative',
		categoryLabel: 'Creative',
		rating: 4.6,
		tagline: 'Short-form edits with studio polish.',
		accent: 'warning',
		mark: 'R'
	},
	{
		id: 'typefoundry',
		name: 'Typefoundry',
		category: 'creative',
		categoryLabel: 'Creative',
		rating: 4.7,
		tagline: 'Specimen sheets for modern type.',
		accent: 'primary',
		mark: 'T'
	},
	{
		id: 'shipyard',
		name: 'Shipyard',
		category: 'developer',
		categoryLabel: 'Developer',
		rating: 4.9,
		tagline: 'Release trains you can actually trust.',
		accent: 'success',
		mark: 'S'
	},
	{
		id: 'trace',
		name: 'Trace',
		category: 'developer',
		categoryLabel: 'Developer',
		rating: 4.5,
		tagline: 'Observability with a human timeline.',
		accent: 'info',
		mark: 'T'
	},
	{
		id: 'schema',
		name: 'Schema',
		category: 'developer',
		categoryLabel: 'Developer',
		rating: 4.6,
		tagline: 'API design that stays consistent.',
		accent: 'secondary',
		mark: 'S'
	},
	{
		id: 'compass',
		name: 'Compass',
		category: 'utilities',
		categoryLabel: 'Utilities',
		rating: 4.4,
		tagline: 'Local file tools with cloud manners.',
		accent: 'primary',
		mark: 'C'
	},
	{
		id: 'beacon',
		name: 'Beacon',
		category: 'utilities',
		categoryLabel: 'Utilities',
		rating: 4.3,
		tagline: 'Status pages that look intentional.',
		accent: 'warning',
		mark: 'B'
	},
	{
		id: 'ledger',
		name: 'Ledger Lite',
		category: 'utilities',
		categoryLabel: 'Utilities',
		rating: 4.5,
		tagline: 'Personal finance, paper-grain calm.',
		accent: 'success',
		mark: 'L'
	}
];

export function getFeaturedApp(): StoreApp {
	return STORE_APPS.find((a) => a.featured) ?? STORE_APPS[0];
}

export function getStoreRows(): StoreRow[] {
	const byCategory = (id: StoreCategoryId) => STORE_APPS.filter((a) => a.category === id);

	return [
		{
			id: 'editors-picks',
			title: "Editors' picks",
			subtitle: 'Hand-chosen software worth opening today.',
			apps: byCategory('editors-picks')
		},
		{
			id: 'productivity',
			title: 'Productivity',
			subtitle: 'Boards, docs, and desks that stay quiet.',
			apps: byCategory('productivity')
		},
		{
			id: 'creative',
			title: 'Creative',
			subtitle: 'Tools for ink, type, and motion.',
			apps: byCategory('creative')
		},
		{
			id: 'developer',
			title: 'Developer',
			subtitle: 'Ship, observe, and design APIs cleanly.',
			apps: byCategory('developer')
		},
		{
			id: 'utilities',
			title: 'Utilities',
			subtitle: 'Everyday tools with quiet polish.',
			apps: byCategory('utilities')
		}
	];
}
