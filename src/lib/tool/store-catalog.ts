/** Real Menzies web-service plans, apps, and library items for the landing home page. */

import {
	DBMS_DRIVER_EXTENSIONS,
	DRIVER_EXTENSION_VERSION,
	driverExtensionPackagePath
} from '$lib/tool/dbms-driver-extensions';
import { driverExtensionTagline } from '$lib/tool/extension-taglines';

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

export type MenziesExtension = {
	id: string;
	name: string;
	kind: string;
	tagline: string;
	version?: string;
	/** Public URL under `/static` (served from site root). */
	logoSrc?: string;
	/** Simple Icons slug when logoSrc is not used. */
	iconSlug?: string;
	ctaLabel: string;
	ctaHref: string;
	secondaryCtaLabel?: string;
	secondaryCtaHref?: string;
};

export const MENZIES_APPS: MenziesApp[] = [
	{
		id: 'portal',
		name: 'Portal',
		kind: 'Desktop',
		tagline: 'OpenVPN client with Wash UI for the Menzies desktop suite.',
		description:
			'Linux-first OpenVPN client for Menzies OS. Import .ovpn files or folders, connect with a simple Wash UI, and keep OpenVPN bundled inside the app. Updates ship through GitHub Releases.',
		accent: 'accent',
		iconSrc: '/portal-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/portal-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/portal-desktop-menzies/releases/latest/download/latest.json'
	},
	{
		id: 'dbms',
		name: 'Database Manager',
		kind: 'Desktop',
		tagline: 'Multi-engine database IDE for the Menzies desktop suite.',
		description:
			'Linux-first database manager for PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, and MongoDB. Connections with groups and keyring passwords, schema navigator, query consoles, editable grids, and Wash UI chrome. Updates ship through GitHub Releases.',
		accent: 'success',
		iconSrc: '/dbms-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/dbms-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/dbms-desktop-menzies/releases/latest/download/latest.json'
	},
	{
		id: 'keycraft',
		name: 'Keycraft',
		kind: 'Desktop',
		tagline: 'Keyboard discovery, remapping, and typing lab for Menzies.',
		description:
			'Linux-first keyboard app for device discovery, capability-gated customization, offline firmware import, local keystroke sounds, system remapping, and a typing lab. Updates ship through GitHub Releases.',
		accent: 'warning',
		iconSrc: '/keycraft-app-icon.svg',
		githubUrl: 'https://github.com/menzies-mariesta-com/keycraft-desktop-menzies',
		latestJsonUrl:
			'https://github.com/menzies-mariesta-com/keycraft-desktop-menzies/releases/latest/download/latest.json'
	},
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
		ctaHref: 'https://medora-menzies.mariesta.com'
	},
	{
		id: 'nextup',
		name: 'NextUp',
		kind: 'Web service',
		description:
			'Multi-tenant queue management for lobbies and counters: kiosk, QR tickets, TV voice calling, and appointments.',
		logoSrc: '/loomline-logo.svg',
		ctaLabel: 'Learn more',
		ctaHref: 'https://nextup-menzies.mariesta.com'
	},
	{
		id: 'lumi-studio',
		name: 'Lumi Studio',
		kind: 'Web service',
		description:
			'Client onboarding, studio chat, and project tracking from pitch through scoped delivery and file handoff.',
		logoSrc: '/lumi-studio-logo.png',
		ctaLabel: 'Learn more',
		ctaHref: 'https://lumistudio-menzies.mariesta.com'
	}
];

export const MENZIES_LIBRARY: MenziesLibraryItem[] = [
	{
		id: 'wash-ui',
		name: 'Wash UI',
		kind: 'Design library',
		tagline: 'Component library and design system for Menzies products.',
		version: '1.7.0',
		logoSrc: '/wash-ui-logo.svg',
		ctaLabel: 'Open gallery',
		ctaHref: 'https://design-menzies.netlify.app',
		secondaryCtaLabel: 'GitHub',
		secondaryCtaHref: 'https://github.com/menzies-mariesta-com/design-lib-menzies'
	}
];

/** Signed desktop extension packages (home + catalog). */
export const MENZIES_EXTENSIONS: MenziesExtension[] = [
	{
		id: 'face-recognition',
		name: 'Face recognition',
		kind: 'Gallery extension',
		tagline: 'Offline Gallery add-on. Detects and groups faces on your computer.',
		version: '1.0.0',
		logoSrc: '/extensions-logo.svg',
		ctaLabel: 'Download',
		ctaHref: '/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip',
		secondaryCtaLabel: 'Registry',
		secondaryCtaHref: '/extensions/registry.json'
	},
	...DBMS_DRIVER_EXTENSIONS.map((driver) => ({
		id: driver.id,
		name: driver.name,
		kind: 'Database Manager extension',
		tagline: driverExtensionTagline(driver.id, driver.name),
		version: DRIVER_EXTENSION_VERSION,
		iconSlug: driver.iconSlug,
		ctaLabel: 'Download',
		ctaHref: driverExtensionPackagePath(driver.id),
		secondaryCtaLabel: 'Registry',
		secondaryCtaHref: '/extensions/registry.json'
	}))
];
