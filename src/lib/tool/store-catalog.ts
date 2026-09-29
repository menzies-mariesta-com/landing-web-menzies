/** Real Menzies web-service plans, apps, and library items for the landing home page. */

export type MenziesApp = {
	id: string;
	name: string;
	kind: string;
	tagline: string;
	description: string;
	accent: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning';
	/** Public URL under `/static` (served from site root). */
	iconSrc: string;
	githubUrl: string;
	latestJsonUrl: string;
};

export type MenziesPlan = {
	id: string;
	name: string;
	kind: string;
	description: string;
	/** Public URL under `/static` (served from site root). */
	logoSrc: string;
	ctaLabel: string;
	ctaHref: string;
};

export type MenziesLibraryItem = {
	id: string;
	name: string;
	kind: string;
	tagline: string;
	version?: string;
	/** Public URL under `/static` (served from site root). */
	logoSrc: string;
	ctaLabel: string;
	ctaHref: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
};

export const MENZIES_APPS: MenziesApp[] = [
	{
		id: 'calculator',
		name: 'Calculator',
		kind: 'Desktop',
		tagline: 'Standard and scientific calculator for the Menzies desktop suite.',
		description:
			'Linux-first desktop calculator with standard and scientific pads, unit conversion, history, and Wash UI chrome. Updates ship through GitHub Releases.',
		accent: 'primary',
		iconSrc: '/calculator-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/calculator-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/calculator-desktop-menzies/releases/latest/download/latest.json'
	},
	{
		id: 'gallery',
		name: 'Gallery',
		kind: 'Desktop',
		tagline: 'Browse Pictures with a quiet lightbox and folder grid.',
		description:
			'Image gallery for the Menzies desktop suite. Opens your Pictures folder by default, browses subfolders from the grid, and opens a quiet lightbox viewer.',
		accent: 'secondary',
		iconSrc: '/gallery-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/gallery-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/gallery-desktop-menzies/releases/latest/download/latest.json'
	},
	{
		id: 'notepad',
		name: 'Notepad',
		kind: 'Desktop',
		tagline: 'Plain-text editing with tabs, find/replace, and autosave.',
		description:
			'Plain-text notepad for UTF-8 files with tabs, find and replace, word wrap, autosave after the first save, and draft persistence for untitled tabs.',
		accent: 'info',
		iconSrc: '/notepad-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/notepad-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/notepad-desktop-menzies/releases/latest/download/latest.json'
	}
];

export const MENZIES_PLANS: MenziesPlan[] = [
	{
		id: 'medora',
		name: 'Medora',
		kind: 'Web service',
		description:
			'Hospital workspace for patients, visits, EMR, billing, inventory, and clinical workflows in one calm console.',
		logoSrc: '/medora-logo.svg',
		ctaLabel: 'Learn more',
		ctaHref: 'https://github.com/menzies-mariesta-com/medora-web-menzies'
	},
	{
		id: 'loomline',
		name: 'Loomline',
		kind: 'Web service',
		description:
			'Multi-tenant queue management for lobbies and counters: kiosk, QR tickets, TV voice calling, and appointments.',
		logoSrc: '/loomline-logo.svg',
		ctaLabel: 'Learn more',
		ctaHref: 'https://github.com/menzies-mariesta-com/loomline-web-menzies'
	},
	{
		id: 'lumi-studio',
		name: 'Lumi Studio',
		kind: 'Web service',
		description:
			'Client onboarding, studio chat, and project tracking from pitch through scoped delivery and file handoff.',
		logoSrc: '/lumi-studio-logo.png',
		ctaLabel: 'Learn more',
		ctaHref: 'https://github.com/menzies-mariesta-com/lumi-studio-web-menzies'
	}
];

export const MENZIES_LIBRARY: MenziesLibraryItem[] = [
	{
		id: 'wash-ui',
		name: 'Wash UI',
		kind: 'Design library',
		tagline: 'Component library and design system for Menzies products.',
		version: '1.3.0',
		logoSrc: '/wash-ui-logo.svg',
		ctaLabel: 'Open gallery',
		ctaHref: 'https://design-menzies.netlify.app',
		secondaryCtaLabel: 'GitHub',
		secondaryCtaHref: 'https://github.com/menzies-mariesta-com/design-lib-menzies'
	}
];
