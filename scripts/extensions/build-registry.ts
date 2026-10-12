/**
 * Validate, sign, and publish the extension registry.
 *
 * Private key (never commit):
 *   MENZIES_EXTENSION_SIGNING_KEY_FILE  path to raw 32-byte Ed25519 key, base64
 *   MENZIES_EXTENSION_SIGNING_KEY       same material inline
 * Default path: ~/.config/menzies/extension-signing/menzies-extensions-ed25519-1.key
 *
 * Commands:
 *   node --experimental-strip-types scripts/extensions/build-registry.ts
 *   node --experimental-strip-types scripts/extensions/build-registry.ts generate
 *   node --experimental-strip-types scripts/extensions/build-registry.ts sign-file <zip>
 */
import {
	createHash,
	createPrivateKey,
	createPublicKey,
	generateKeyPairSync,
	sign,
	verify
} from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	ARTIFACT_DOMAIN,
	EXTENSION_KEY_ID,
	bodiesMatch,
	canonicalJson,
	signingMessage,
	validateRegistry,
	type RegistryBody
} from '../../src/lib/tool/extension-registry.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const sourcePath = resolve(root, 'extensions/registry.source.json');
const publicPath = resolve(root, 'extensions/publisher-key.json');
const staticDir = resolve(root, 'static/extensions');
const registryOut = resolve(staticDir, 'registry.json');
const publicOut = resolve(staticDir, 'publisher-key.json');

const PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

type PublicKeyFile = {
	keyId: string;
	algorithm: 'ed25519';
	publicKey: string;
};

function defaultKeyPath(): string {
	const fromEnv = process.env.MENZIES_EXTENSION_SIGNING_KEY_FILE?.trim();
	if (fromEnv) return fromEnv;
	return resolve(homedir(), '.config/menzies/extension-signing/menzies-extensions-ed25519-1.key');
}

function privateFromRaw(raw: Buffer) {
	if (raw.length !== 32) throw new Error('Ed25519 private key must be 32 bytes');
	return createPrivateKey({
		key: Buffer.concat([PKCS8_PREFIX, raw]),
		format: 'der',
		type: 'pkcs8'
	});
}

function publicFromRaw(raw: Buffer) {
	if (raw.length !== 32) throw new Error('Ed25519 public key must be 32 bytes');
	return createPublicKey({
		key: Buffer.concat([SPKI_PREFIX, raw]),
		format: 'der',
		type: 'spki'
	});
}

function rawPublicFromPrivate(rawPriv: Buffer): Buffer {
	const der = createPublicKey(privateFromRaw(rawPriv)).export({
		format: 'der',
		type: 'spki'
	}) as Buffer;
	return der.subarray(der.length - 32);
}

function loadPrivate(): Buffer | null {
	const inline = process.env.MENZIES_EXTENSION_SIGNING_KEY?.trim();
	if (inline) {
		const raw = Buffer.from(inline, 'base64');
		if (raw.length !== 32) throw new Error('MENZIES_EXTENSION_SIGNING_KEY is not 32 bytes');
		return raw;
	}
	const path = defaultKeyPath();
	if (!existsSync(path)) return null;
	const raw = Buffer.from(readFileSync(path, 'utf8').trim(), 'base64');
	if (raw.length !== 32) throw new Error(`${path} is not a 32-byte Ed25519 key`);
	return raw;
}

function readJson(path: string): unknown {
	return JSON.parse(readFileSync(path, 'utf8')) as unknown;
}

function writePublic(rawPub: Buffer): PublicKeyFile {
	const file: PublicKeyFile = {
		keyId: EXTENSION_KEY_ID,
		algorithm: 'ed25519',
		publicKey: rawPub.toString('base64')
	};
	mkdirSync(dirname(publicPath), { recursive: true });
	writeFileSync(publicPath, `${JSON.stringify(file, null, '\t')}\n`);
	return file;
}

function readPublic(): PublicKeyFile {
	const parsed = readJson(publicPath);
	if (!parsed || typeof parsed !== 'object') throw new Error('publisher key file is invalid');
	const file = parsed as PublicKeyFile;
	if (file.keyId !== EXTENSION_KEY_ID || file.algorithm !== 'ed25519') {
		throw new Error('publisher key file does not match the pinned key id');
	}
	const raw = Buffer.from(file.publicKey, 'base64');
	if (raw.length !== 32) throw new Error('publisher public key must be 32 bytes');
	return file;
}

function signMessage(rawPriv: Buffer, message: Uint8Array): string {
	return sign(null, Buffer.from(message), privateFromRaw(rawPriv)).toString('base64');
}

function verifyMessage(rawPub: Buffer, message: Uint8Array, signature: string): boolean {
	return verify(
		null,
		Buffer.from(message),
		publicFromRaw(rawPub),
		Buffer.from(signature, 'base64')
	);
}

function readSourceBody(): RegistryBody {
	const validated = validateRegistry(readJson(sourcePath), false);
	if ('signature' in validated) throw new Error('source registry must be unsigned');
	return validated;
}

function publish(body: RegistryBody, signature: string, publicFile: PublicKeyFile): void {
	const signed = validateRegistry({ ...body, signature }, true);
	mkdirSync(staticDir, { recursive: true });
	writeFileSync(registryOut, `${canonicalJson(signed)}\n`);
	writeFileSync(publicOut, `${JSON.stringify(publicFile, null, '\t')}\n`);
	const roundTrip = validateRegistry(readJson(registryOut), true);
	if (!('signature' in roundTrip) || roundTrip.signature !== signature) {
		throw new Error('signed registry did not round-trip');
	}
	const roundBody: RegistryBody = {
		schema: roundTrip.schema,
		sequence: roundTrip.sequence,
		issuedAt: roundTrip.issuedAt,
		keyId: roundTrip.keyId,
		revoked: roundTrip.revoked,
		extensions: roundTrip.extensions
	};
	if (!bodiesMatch(roundBody, body)) throw new Error('signed body drifted from source');
	const rawPub = Buffer.from(publicFile.publicKey, 'base64');
	if (!verifyMessage(rawPub, signingMessage(body), signature)) {
		throw new Error('signed registry failed verification');
	}
}

function generate(): void {
	const path = defaultKeyPath();
	let rawPriv = loadPrivate();
	if (!rawPriv) {
		const { privateKey } = generateKeyPairSync('ed25519');
		const der = privateKey.export({ format: 'der', type: 'pkcs8' }) as Buffer;
		rawPriv = der.subarray(der.length - 32);
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, `${rawPriv.toString('base64')}\n`, { mode: 0o600 });
		chmodSync(path, 0o600);
		process.stdout.write(`Wrote signing key to ${path}\n`);
		process.stdout.write('Back this file up offline. It is not in git.\n');
	} else {
		process.stdout.write(`Signing key already present at ${path}\n`);
	}
	const rawPub = rawPublicFromPrivate(rawPriv);
	if (existsSync(publicPath)) {
		const current = Buffer.from(readPublic().publicKey, 'base64');
		if (!current.equals(rawPub)) {
			throw new Error('existing publisher-key.json does not match the private key');
		}
	}
	writePublic(rawPub);
	process.stdout.write(`Public key id ${EXTENSION_KEY_ID}\n`);
}

function signFile(filePath: string): void {
	const rawPriv = loadPrivate();
	if (!rawPriv) throw new Error('signing key is not available');
	const bytes = readFileSync(filePath);
	const digest = createHash('sha256').update(bytes).digest('hex');
	const prefix = Buffer.from(`${ARTIFACT_DOMAIN}\n`);
	const message = Buffer.concat([prefix, bytes]);
	const signature = signMessage(rawPriv, message);
	process.stdout.write(`sha256 ${digest}\n`);
	process.stdout.write(`signature ${signature}\n`);
	process.stdout.write(`size ${bytes.length}\n`);
}

function assertPublishedFiles(body: RegistryBody): void {
	for (const entry of body.extensions) {
		if (entry.availability !== 'available' || !entry.release) continue;
		for (const artifact of entry.release.artifacts) {
			const parsed = new URL(artifact.url);
			if (parsed.hostname !== 'menzies.mariesta.com') continue;
			const rel = parsed.pathname.replace(/^\//, '');
			const file = resolve(root, 'static', rel);
			if (!existsSync(file)) throw new Error(`missing static file ${rel}`);
			const bytes = readFileSync(file);
			if (bytes.length !== artifact.size) {
				throw new Error(
					`size mismatch for ${rel}: file ${bytes.length}, registry ${artifact.size}`
				);
			}
			const digest = createHash('sha256').update(bytes).digest('hex');
			if (digest !== artifact.sha256) throw new Error(`sha256 mismatch for ${rel}`);
		}
	}
}

function build(): void {
	const body = readSourceBody();
	assertPublishedFiles(body);
	const rawPriv = loadPrivate();
	if (rawPriv) {
		const rawPub = rawPublicFromPrivate(rawPriv);
		const publicFile = existsSync(publicPath) ? readPublic() : writePublic(rawPub);
		const pinned = Buffer.from(publicFile.publicKey, 'base64');
		if (!pinned.equals(rawPub)) {
			throw new Error('private key does not match extensions/publisher-key.json');
		}
		const signature = signMessage(rawPriv, signingMessage(body));
		publish(body, signature, publicFile);
		process.stdout.write(`Signed ${registryOut}\n`);
		return;
	}
	if (!existsSync(registryOut) || !existsSync(publicPath)) {
		throw new Error(
			'No signing key and no published registry. Run the generate command on a release machine.'
		);
	}
	const publicFile = readPublic();
	const signed = validateRegistry(readJson(registryOut), true);
	if (!('signature' in signed)) throw new Error('published registry is unsigned');
	const { signature, ...signedBody } = signed;
	if (!bodiesMatch(signedBody, body)) {
		throw new Error('published registry does not match extensions/registry.source.json');
	}
	const rawPub = Buffer.from(publicFile.publicKey, 'base64');
	if (!verifyMessage(rawPub, signingMessage(body), signature)) {
		throw new Error('published registry signature is invalid');
	}
	writeFileSync(publicOut, `${JSON.stringify(publicFile, null, '\t')}\n`);
	process.stdout.write('Verified published registry without a private key\n');
}

const command = process.argv[2] ?? 'build';
try {
	if (command === 'generate') generate();
	else if (command === 'sign-file') {
		const filePath = process.argv[3];
		if (!filePath) throw new Error('sign-file requires a path');
		signFile(filePath);
	} else if (command === 'build') build();
	else throw new Error(`unknown command ${command}`);
} catch (error) {
	const message = error instanceof Error ? error.message : 'extension registry build failed';
	process.stderr.write(`${message}\n`);
	process.exitCode = 1;
}
