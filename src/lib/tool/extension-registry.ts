/**
 * Signed extension registry (schema menzies-extension-registry/1).
 * Pure validation and canonical JSON. Signing uses Node in scripts/extensions.
 * No private key material belongs in this module.
 */

export const REGISTRY_SCHEMA = 'menzies-extension-registry/1';
export const SIGNING_DOMAIN = 'menzies-extension-registry/1';
export const ARTIFACT_DOMAIN = 'menzies-extension-artifact/1';
export const EXTENSION_KEY_ID = 'menzies-extensions-ed25519-1';
export const REGISTRY_PATH = '/extensions/registry.json';
export const PUBLISHER_KEY_PATH = '/extensions/publisher-key.json';
export const DEFAULT_REGISTRY_URL = 'https://menzies.mariesta.com/extensions/registry.json';

/** Production catalog host. Loopback is only for a developer registryUrl override. */
export const REGISTRY_HOST = 'menzies.mariesta.com';
const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost']);

export const MAX_PACKAGE_BYTES = 200 * 1024 * 1024;

const SEMVER = /^(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const SHA256_RE = /^[0-9a-f]{64}$/;
const REASON_RE = /^[a-z0-9_]{1,64}$/;
const SIG_RE = /^[A-Za-z0-9+/]{86}==$/;

const PLATFORMS = ['linux', 'darwin', 'windows'] as const;
const OS_IDS = ['linux', 'darwin', 'windows', 'any'] as const;
const ARCH_IDS = ['x86_64', 'aarch64', 'any'] as const;
const UPDATE_MODES = ['manual', 'automatic'] as const;

export type Platform = (typeof PLATFORMS)[number];
export type OsId = (typeof OS_IDS)[number];
export type ArchId = (typeof ARCH_IDS)[number];
export type UpdateMode = (typeof UPDATE_MODES)[number];

export type Artifact = {
	os: OsId;
	arch: ArchId;
	url: string;
	sha256: string;
	size: number;
	signature: string;
};

export type Release = {
	version: string;
	minAppVersion: string;
	releasedAt: string;
	notes?: string;
	artifacts: Artifact[];
};

export type ExtensionEntry = {
	id: string;
	appId: string;
	name: string;
	summary: string;
	availability: 'available' | 'unavailable';
	unavailableReason?: string;
	defaultUpdateMode: UpdateMode;
	platforms: Platform[];
	release?: Release;
};

export type Revocation = {
	id: string;
	version: string;
	sha256?: string;
};

export type RegistryBody = {
	schema: typeof REGISTRY_SCHEMA;
	sequence: number;
	issuedAt: string;
	keyId: string;
	revoked: Revocation[];
	extensions: ExtensionEntry[];
};

export type SignedRegistry = RegistryBody & { signature: string };

export class RegistrySchemaError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'RegistrySchemaError';
	}
}

function fail(message: string): never {
	throw new RegistrySchemaError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function assertKeys(value: Record<string, unknown>, allowed: readonly string[]): void {
	for (const key of Object.keys(value)) {
		if (!allowed.includes(key)) fail(`unknown field ${key}`);
	}
}

function readString(value: unknown, field: string, max: number): string {
	if (typeof value !== 'string' || value.length === 0 || value.length > max) {
		fail(`invalid ${field}`);
	}
	if (value.includes('://')) fail(`${field} must not contain a URL`);
	return value;
}

function readSemver(value: unknown, field: string): string {
	if (typeof value !== 'string' || !SEMVER.test(value)) fail(`invalid ${field}`);
	return value;
}

function readId(value: unknown, field: string): string {
	if (typeof value !== 'string' || !ID_RE.test(value)) fail(`invalid ${field}`);
	return value;
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[], field: string): T {
	if (typeof value !== 'string' || !allowed.includes(value as T)) fail(`invalid ${field}`);
	return value as T;
}

function escapeString(value: string): string {
	let out = '"';
	for (const ch of value) {
		switch (ch) {
			case '"':
				out += '\\"';
				break;
			case '\\':
				out += '\\\\';
				break;
			case '\b':
				out += '\\b';
				break;
			case '\f':
				out += '\\f';
				break;
			case '\n':
				out += '\\n';
				break;
			case '\r':
				out += '\\r';
				break;
			case '\t':
				out += '\\t';
				break;
			default: {
				const code = ch.codePointAt(0) ?? 0;
				if (code < 0x20) {
					out += `\\u${code.toString(16).padStart(4, '0')}`;
				} else {
					out += ch;
				}
			}
		}
	}
	return `${out}"`;
}

/** Canonical JSON: sorted keys, no whitespace, integers only, UTF-8 strings. */
export function canonicalJson(value: unknown): string {
	if (value === null) return 'null';
	if (typeof value === 'boolean') return value ? 'true' : 'false';
	if (typeof value === 'number') {
		if (!Number.isSafeInteger(value)) fail('canonical JSON allows safe integers only');
		return String(value);
	}
	if (typeof value === 'string') return escapeString(value);
	if (Array.isArray(value)) {
		return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
	}
	if (!isRecord(value)) fail('canonical JSON value is not supported');
	const keys = Object.keys(value).sort();
	const parts = keys.map((key) => {
		if (value[key] === undefined) fail('canonical JSON does not allow undefined');
		return `${escapeString(key)}:${canonicalJson(value[key])}`;
	});
	return `{${parts.join(',')}}`;
}

export function signingMessage(body: RegistryBody): Uint8Array {
	return new TextEncoder().encode(`${SIGNING_DOMAIN}\n${canonicalJson(body)}`);
}

export function artifactSigningMessage(bytes: Uint8Array): Uint8Array {
	const prefix = new TextEncoder().encode(`${ARTIFACT_DOMAIN}\n`);
	const out = new Uint8Array(prefix.length + bytes.length);
	out.set(prefix, 0);
	out.set(bytes, prefix.length);
	return out;
}

function packageUrl(appId: string, id: string, version: string, os: OsId, arch: ArchId): string {
	return `/extensions/packages/${appId}/${id}/${version}/${os}-${arch}.zip`;
}

export function assertArtifactUrl(
	url: string,
	appId: string,
	id: string,
	version: string,
	os: OsId,
	arch: ArchId
): void {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		fail('artifact URL is invalid');
	}
	if (parsed.username || parsed.password) fail('artifact URL must not include credentials');
	if (parsed.search || parsed.hash) fail('artifact URL must not include a query or hash');
	if (parsed.hostname === REGISTRY_HOST) {
		if (parsed.protocol !== 'https:' || parsed.port !== '') {
			fail('artifact URL must be https on the default port');
		}
	} else if (LOOPBACK_HOSTS.has(parsed.hostname)) {
		const port = Number(parsed.port);
		if (parsed.protocol !== 'http:' || !Number.isInteger(port) || port < 1 || port > 65535) {
			fail('loopback artifact URL must be http with a non-zero port');
		}
	} else {
		fail('artifact URL host is not allowlisted');
	}
	const expected = packageUrl(appId, id, version, os, arch);
	if (parsed.pathname !== expected) fail('artifact URL path does not match the package id');
}

function readArtifact(value: unknown, appId: string, id: string, version: string): Artifact {
	if (!isRecord(value)) fail('invalid artifact');
	assertKeys(value, ['os', 'arch', 'url', 'sha256', 'size', 'signature']);
	const os = oneOf(value.os, OS_IDS, 'os');
	const arch = oneOf(value.arch, ARCH_IDS, 'arch');
	if (typeof value.url !== 'string') fail('invalid url');
	assertArtifactUrl(value.url, appId, id, version, os, arch);
	if (typeof value.sha256 !== 'string' || !SHA256_RE.test(value.sha256)) fail('invalid sha256');
	if (typeof value.size !== 'number' || !Number.isSafeInteger(value.size)) fail('invalid size');
	if (value.size < 1 || value.size > MAX_PACKAGE_BYTES) fail('invalid size');
	if (typeof value.signature !== 'string' || !SIG_RE.test(value.signature)) {
		fail('invalid artifact signature');
	}
	return {
		os,
		arch,
		url: value.url,
		sha256: value.sha256,
		size: value.size,
		signature: value.signature
	};
}

function readRelease(value: unknown, appId: string, id: string): Release {
	if (!isRecord(value)) fail('invalid release');
	assertKeys(value, ['version', 'minAppVersion', 'releasedAt', 'notes', 'artifacts']);
	const version = readSemver(value.version, 'version');
	const minAppVersion = readSemver(value.minAppVersion, 'minAppVersion');
	if (typeof value.releasedAt !== 'string' || !ISO_UTC.test(value.releasedAt)) {
		fail('invalid releasedAt');
	}
	let notes: string | undefined;
	if (value.notes !== undefined) {
		notes = readString(value.notes, 'notes', 400);
	}
	if (!Array.isArray(value.artifacts) || value.artifacts.length < 1 || value.artifacts.length > 8) {
		fail('invalid artifacts');
	}
	const artifacts = value.artifacts.map((item) => readArtifact(item, appId, id, version));
	const seen = new Set<string>();
	for (const artifact of artifacts) {
		const key = `${artifact.os}:${artifact.arch}`;
		if (seen.has(key)) fail('duplicate artifact target');
		seen.add(key);
	}
	return { version, minAppVersion, releasedAt: value.releasedAt, notes, artifacts };
}

function readExtension(value: unknown): ExtensionEntry {
	if (!isRecord(value)) fail('invalid extension');
	assertKeys(value, [
		'id',
		'appId',
		'name',
		'summary',
		'availability',
		'unavailableReason',
		'defaultUpdateMode',
		'platforms',
		'release'
	]);
	const id = readId(value.id, 'id');
	const appId = readId(value.appId, 'appId');
	const name = readString(value.name, 'name', 80);
	const summary = readString(value.summary, 'summary', 400);
	const availability = oneOf(
		value.availability,
		['available', 'unavailable'] as const,
		'availability'
	);
	const defaultUpdateMode = oneOf(value.defaultUpdateMode, UPDATE_MODES, 'defaultUpdateMode');
	if (!Array.isArray(value.platforms) || value.platforms.length < 1 || value.platforms.length > 3) {
		fail('invalid platforms');
	}
	const platforms = value.platforms.map((item) => oneOf(item, PLATFORMS, 'platforms'));
	if (new Set(platforms).size !== platforms.length) fail('duplicate platform');

	if (availability === 'unavailable') {
		if (value.release !== undefined) fail('unavailable extension must not include a release');
		if (typeof value.unavailableReason !== 'string' || !REASON_RE.test(value.unavailableReason)) {
			fail('invalid unavailableReason');
		}
		return {
			id,
			appId,
			name,
			summary,
			availability,
			unavailableReason: value.unavailableReason,
			defaultUpdateMode,
			platforms
		};
	}

	if (value.unavailableReason !== undefined) {
		fail('available extension must not include unavailableReason');
	}
	return {
		id,
		appId,
		name,
		summary,
		availability,
		defaultUpdateMode,
		platforms,
		release: readRelease(value.release, appId, id)
	};
}

function readRevocation(value: unknown): Revocation {
	if (!isRecord(value)) fail('invalid revocation');
	assertKeys(value, ['id', 'version', 'sha256']);
	const id = readId(value.id, 'revoked.id');
	const version = readSemver(value.version, 'revoked.version');
	if (value.sha256 === undefined) return { id, version };
	if (typeof value.sha256 !== 'string' || !SHA256_RE.test(value.sha256)) {
		fail('invalid revoked sha256');
	}
	return { id, version, sha256: value.sha256 };
}

export function validateRegistry(value: unknown, signed: boolean): SignedRegistry | RegistryBody {
	if (!isRecord(value)) fail('registry must be an object');
	const allowed = ['schema', 'sequence', 'issuedAt', 'keyId', 'revoked', 'extensions'];
	if (signed) allowed.push('signature');
	assertKeys(value, allowed);
	if (value.schema !== REGISTRY_SCHEMA) fail('invalid schema');
	if (
		typeof value.sequence !== 'number' ||
		!Number.isSafeInteger(value.sequence) ||
		value.sequence < 1
	) {
		fail('invalid sequence');
	}
	if (typeof value.issuedAt !== 'string' || !ISO_UTC.test(value.issuedAt)) fail('invalid issuedAt');
	if (value.keyId !== EXTENSION_KEY_ID) fail('invalid keyId');
	if (!Array.isArray(value.revoked) || value.revoked.length > 64) fail('invalid revoked');
	if (
		!Array.isArray(value.extensions) ||
		value.extensions.length < 1 ||
		value.extensions.length > 64
	) {
		fail('invalid extensions');
	}
	const revoked = value.revoked.map((item) => readRevocation(item));
	const extensions = value.extensions.map((item) => readExtension(item));
	const ids = new Set<string>();
	for (const entry of extensions) {
		const key = `${entry.appId}:${entry.id}`;
		if (ids.has(key)) fail('duplicate extension');
		ids.add(key);
	}
	const body: RegistryBody = {
		schema: REGISTRY_SCHEMA,
		sequence: value.sequence,
		issuedAt: value.issuedAt,
		keyId: EXTENSION_KEY_ID,
		revoked,
		extensions
	};
	if (!signed) return body;
	if (typeof value.signature !== 'string' || !SIG_RE.test(value.signature)) {
		fail('invalid registry signature');
	}
	return { ...body, signature: value.signature };
}

export function bodiesMatch(left: RegistryBody, right: RegistryBody): boolean {
	return canonicalJson(left) === canonicalJson(right);
}
