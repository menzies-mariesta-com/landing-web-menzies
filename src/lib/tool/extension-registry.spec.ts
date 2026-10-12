import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	EXTENSION_KEY_ID,
	REGISTRY_SCHEMA,
	RegistrySchemaError,
	bodiesMatch,
	canonicalJson,
	signingMessage,
	validateRegistry,
	type RegistryBody
} from './extension-registry';

const root = resolve(process.cwd());
const SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex');

function publicFromRaw(raw: Buffer) {
	return createPublicKey({
		key: Buffer.concat([SPKI_PREFIX, raw]),
		format: 'der',
		type: 'spki'
	});
}

describe('extension registry', () => {
	it('canonicalizes objects with sorted keys and escaped strings', () => {
		expect(canonicalJson({ b: 'a"b', a: [1, true, null] })).toBe('{"a":[1,true,null],"b":"a\\"b"}');
	});

	it('publishes face recognition for linux with a real package', () => {
		const source = JSON.parse(
			readFileSync(resolve(root, 'extensions/registry.source.json'), 'utf8')
		) as unknown;
		const body = validateRegistry(source, false) as RegistryBody;
		expect(body.schema).toBe(REGISTRY_SCHEMA);
		expect(body.sequence).toBeGreaterThanOrEqual(3);
		expect(body.keyId).toBe(EXTENSION_KEY_ID);
		expect(body.extensions).toHaveLength(5);
		const face = body.extensions.find((entry) => entry.id === 'face-recognition');
		expect(face?.id).toBe('face-recognition');
		expect(face?.availability).toBe('available');
		expect(face?.unavailableReason).toBeUndefined();
		expect(face?.defaultUpdateMode).toBe('manual');
		expect(face?.platforms).toEqual(['linux']);
		const artifact = face?.release?.artifacts[0];
		expect(face?.release?.version).toBe('1.0.0');
		expect(face?.release?.minAppVersion).toBe('0.1.3');
		expect(artifact?.os).toBe('linux');
		expect(artifact?.arch).toBe('x86_64');
		expect(artifact?.url).toBe(
			'https://menzies.mariesta.com/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip'
		);
		const zipPath = resolve(
			root,
			'static/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip'
		);
		const zip = readFileSync(zipPath);
		expect(statSync(zipPath).size).toBe(artifact?.size);
		expect(createHash('sha256').update(zip).digest('hex')).toBe(artifact?.sha256);

		const postgres = body.extensions.find((entry) => entry.id === 'driver-postgres');
		expect(postgres?.appId).toBe('dbms-desktop-menzies');
		expect(postgres?.availability).toBe('available');
		expect(postgres?.release?.version).toBe('0.1.0');
		expect(postgres?.release?.minAppVersion).toBe('0.1.0');
		const pgArtifact = postgres?.release?.artifacts[0];
		expect(pgArtifact?.url).toBe(
			'https://menzies.mariesta.com/extensions/packages/dbms-desktop-menzies/driver-postgres/0.1.0/linux-x86_64.zip'
		);
		const pgZipPath = resolve(
			root,
			'static/extensions/packages/dbms-desktop-menzies/driver-postgres/0.1.0/linux-x86_64.zip'
		);
		const pgZip = readFileSync(pgZipPath);
		expect(statSync(pgZipPath).size).toBe(pgArtifact?.size);
		expect(createHash('sha256').update(pgZip).digest('hex')).toBe(pgArtifact?.sha256);
		expect(
			body.extensions.filter((entry) => entry.appId === 'dbms-desktop-menzies').map((e) => e.id)
		).toEqual(['driver-postgres', 'driver-mysql', 'driver-mssql', 'driver-mongodb']);
		const serialized = JSON.stringify(source);
		expect(serialized.includes('store.menzies.design')).toBe(false);
		expect(serialized.includes('http://')).toBe(false);

		const signedRaw = JSON.parse(
			readFileSync(resolve(root, 'static/extensions/registry.json'), 'utf8')
		) as unknown;
		const signed = validateRegistry(signedRaw, true);
		expect('signature' in signed).toBe(true);
		if (!('signature' in signed)) return;
		const { signature, ...signedBody } = signed;
		expect(bodiesMatch(signedBody, body)).toBe(true);

		const publicFile = JSON.parse(
			readFileSync(resolve(root, 'extensions/publisher-key.json'), 'utf8')
		) as { keyId: string; publicKey: string };
		expect(publicFile.keyId).toBe(EXTENSION_KEY_ID);
		const rawPub = Buffer.from(publicFile.publicKey, 'base64');
		expect(rawPub.length).toBe(32);
		const ok = verify(
			null,
			Buffer.from(signingMessage(body)),
			publicFromRaw(rawPub),
			Buffer.from(signature, 'base64')
		);
		expect(ok).toBe(true);
		expect(createHash('sha256').update(rawPub).digest('hex').length).toBe(64);
	});

	it('rejects a broken artifact URL and unknown fields', () => {
		const source = validateRegistry(
			JSON.parse(readFileSync(resolve(root, 'extensions/registry.source.json'), 'utf8')) as unknown,
			false
		) as RegistryBody;
		const broken = {
			...source,
			extensions: [
				{
					...source.extensions[0],
					availability: 'available',
					unavailableReason: undefined,
					release: {
						version: '1.0.0',
						minAppVersion: '0.1.3',
						releasedAt: '2026-10-12T05:30:00Z',
						artifacts: [
							{
								os: 'linux',
								arch: 'x86_64',
								url: 'https://evil.example/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip',
								sha256: 'a'.repeat(64),
								size: 10,
								signature: `${'A'.repeat(86)}==`
							}
						]
					}
				}
			]
		};
		expect(() => validateRegistry(broken, false)).toThrow(RegistrySchemaError);
		const storeHost = {
			...broken,
			extensions: [
				{
					...broken.extensions[0],
					release: {
						...broken.extensions[0].release,
						artifacts: [
							{
								...broken.extensions[0].release.artifacts[0],
								url: 'https://store.menzies.design/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip'
							}
						]
					}
				}
			]
		};
		expect(() => validateRegistry(storeHost, false)).toThrow(RegistrySchemaError);
		const loopback = {
			...source,
			extensions: [
				{
					...source.extensions[0],
					release: {
						...source.extensions[0].release,
						artifacts: [
							{
								...source.extensions[0].release?.artifacts[0],
								url: 'http://127.0.0.1:4010/extensions/packages/gallery-desktop-menzies/face-recognition/1.0.0/linux-x86_64.zip'
							}
						]
					}
				}
			]
		};
		expect(validateRegistry(loopback, false).extensions[0]?.release?.artifacts[0]?.url).toContain(
			'127.0.0.1:4010'
		);
		expect(() => validateRegistry({ ...source, extra: true }, false)).toThrow(RegistrySchemaError);
	});
});
