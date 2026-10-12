import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateRegistry } from '$lib/tool/extension-registry';

function formatBytes(size: number): string {
	const mb = size / (1024 * 1024);
	return `${mb.toFixed(1)} MB (${size} bytes)`;
}

export function load() {
	const raw = JSON.parse(
		readFileSync(resolve('static/extensions/registry.json'), 'utf8')
	) as unknown;
	const doc = validateRegistry(raw, true);
	const face = doc.extensions.find((entry) => entry.id === 'face-recognition');
	const artifact = face?.release?.artifacts.find(
		(item) => item.os === 'linux' && item.arch === 'x86_64'
	);
	if (!face || face.availability !== 'available' || !face.release || !artifact) {
		throw new Error('face recognition package is not in the signed registry');
	}
	return {
		faceVersion: face.release.version,
		faceSize: formatBytes(artifact.size),
		faceTarget: 'Linux x86_64'
	};
}
