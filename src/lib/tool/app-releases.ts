/** Parse Tauri updater `latest.json` release manifests into download rows. */

export type LatestJsonPlatform = {
	url: string;
	signature?: string;
};

export type LatestJson = {
	version: string;
	notes?: string;
	pub_date?: string;
	platforms: Record<string, LatestJsonPlatform>;
};

export type AppDownload = {
	id: string;
	label: string;
	filename: string;
	url: string;
	platformKey: string;
};

export type AppReleaseManifest = {
	version: string;
	notes?: string;
	pubDate?: string;
	downloads: AppDownload[];
};

const EXT_LABELS: Array<{ test: RegExp; label: string }> = [
	{ test: /\.AppImage$/i, label: 'Linux AppImage' },
	{ test: /\.deb$/i, label: 'Debian (.deb)' },
	{ test: /\.rpm$/i, label: 'RPM' },
	{ test: /\.dmg$/i, label: 'macOS (.dmg)' },
	{ test: /\.app\.tar\.gz$/i, label: 'macOS app archive' },
	{ test: /\.msi$/i, label: 'Windows MSI' },
	{ test: /-setup\.exe$/i, label: 'Windows installer (.exe)' },
	{ test: /\.exe$/i, label: 'Windows (.exe)' },
	{ test: /\.tar\.gz$/i, label: 'Archive (.tar.gz)' },
	{ test: /\.zip$/i, label: 'Zip archive' }
];

const PLATFORM_LABELS: Record<string, string> = {
	'darwin-aarch64': 'macOS (Apple Silicon)',
	'darwin-aarch64-app': 'macOS app archive',
	'darwin-x86_64': 'macOS (Intel)',
	'darwin-x86_64-app': 'macOS app archive',
	'linux-x86_64': 'Linux',
	'linux-x86_64-appimage': 'Linux AppImage',
	'linux-x86_64-deb': 'Debian (.deb)',
	'linux-x86_64-rpm': 'RPM',
	'windows-x86_64': 'Windows',
	'windows-x86_64-msi': 'Windows MSI',
	'windows-x86_64-nsis': 'Windows installer (.exe)'
};

function filenameFromUrl(url: string): string {
	try {
		const path = new URL(url).pathname;
		return decodeURIComponent(path.split('/').pop() ?? url);
	} catch {
		return url.split('/').pop() ?? url;
	}
}

function labelForDownload(platformKey: string, filename: string): string {
	for (const { test, label } of EXT_LABELS) {
		if (test.test(filename)) return label;
	}
	return PLATFORM_LABELS[platformKey] ?? platformKey;
}

function isInstallArtifact(filename: string): boolean {
	const lower = filename.toLowerCase();
	if (lower === 'latest.json') return false;
	if (lower.endsWith('.sig')) return false;
	return true;
}

export function parseLatestJson(data: LatestJson): AppReleaseManifest {
	const seen = new Set<string>();
	const downloads: AppDownload[] = [];

	for (const [platformKey, platform] of Object.entries(data.platforms ?? {})) {
		const url = platform?.url?.trim();
		if (!url || seen.has(url)) continue;
		const filename = filenameFromUrl(url);
		if (!isInstallArtifact(filename)) continue;
		seen.add(url);
		downloads.push({
			id: `${platformKey}:${filename}`,
			label: labelForDownload(platformKey, filename),
			filename,
			url,
			platformKey
		});
	}

	downloads.sort((a, b) => a.label.localeCompare(b.label) || a.filename.localeCompare(b.filename));

	return {
		version: data.version,
		notes: data.notes,
		pubDate: data.pub_date,
		downloads
	};
}

export function appLatestProxyPath(appId: string): string {
	return `/api/apps/${encodeURIComponent(appId)}/latest`;
}

function isAppReleaseManifest(value: unknown): value is AppReleaseManifest {
	if (!value || typeof value !== 'object') return false;
	const v = value as AppReleaseManifest;
	return typeof v.version === 'string' && Array.isArray(v.downloads);
}

/** Browser-safe: same-origin proxy that server-fetches GitHub latest.json. */
export async function fetchAppReleaseViaProxy(
	appId: string,
	init?: RequestInit & { timeoutMs?: number }
): Promise<AppReleaseManifest> {
	const timeoutMs = init?.timeoutMs ?? 10000;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const res = await fetch(appLatestProxyPath(appId), {
			...init,
			signal: init?.signal ?? controller.signal,
			headers: {
				Accept: 'application/json',
				...(init?.headers ?? {})
			}
		});

		const body: unknown = await res.json().catch(() => null);
		if (!res.ok) {
			const msg =
				body &&
				typeof body === 'object' &&
				'message' in body &&
				typeof (body as { message: unknown }).message === 'string'
					? (body as { message: string }).message
					: `Release proxy returned ${res.status}`;
			throw new Error(msg);
		}
		if (!isAppReleaseManifest(body)) {
			throw new Error('Release proxy returned an unexpected payload');
		}
		return body;
	} finally {
		clearTimeout(timer);
	}
}

/** Server-side (or Node) fetch of a Tauri updater latest.json URL. */
export async function fetchLatestJson(
	url: string,
	init?: RequestInit & { timeoutMs?: number }
): Promise<AppReleaseManifest> {
	const timeoutMs = init?.timeoutMs ?? 8000;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const res = await fetch(url, {
			...init,
			redirect: 'follow',
			signal: init?.signal ?? controller.signal,
			headers: {
				Accept: 'application/json',
				...(init?.headers ?? {})
			}
		});
		if (!res.ok) {
			throw new Error(`Release manifest returned ${res.status}`);
		}
		const data = (await res.json()) as LatestJson;
		if (!data?.version || !data?.platforms) {
			throw new Error('Release manifest is missing version or platforms');
		}
		return parseLatestJson(data);
	} finally {
		clearTimeout(timer);
	}
}
