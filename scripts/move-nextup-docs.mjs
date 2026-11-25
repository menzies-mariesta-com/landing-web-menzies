/**
 * Copies NextUp docs into the landing docs tree.
 * Frontmatter: adds `tree`, keeps NextUp `section`, rewrites `/docs/...` links
 * to the landing `/docs/nextup/...` prefix.
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = '/home/zarnihlawn/Desktop/nextup-web-menzies/src/content/docs';
const DEST = join(import.meta.dirname, '..', 'src/content/docs/nextup');

rmSync(DEST, { recursive: true, force: true });

function walk(dir, out = []) {
	for (const ent of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name);
		if (ent.isDirectory()) walk(p, out);
		else if (p.endsWith('.md')) out.push(p);
	}
	return out;
}

function splitFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { meta: [], body: raw };
	return {
		meta: match[1].split('\n').filter((line) => line.trim() !== ''),
		body: raw.slice(match[0].length)
	};
}

/** NextUp trees become `section` labels; keep their own `section` values. */
const files = walk(SRC);
let count = 0;

for (const file of files) {
	const rel = relative(SRC, file);
	const { meta, body } = splitFrontmatter(readFileSync(file, 'utf8'));

	const kept = meta.filter(
		(line) => !/^(tree|title|description|section|order):/.test(line.trim())
	);
	const get = (key) => {
		const hit = meta.find((line) => line.trim().startsWith(`${key}:`));
		return hit ? hit.slice(hit.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '') : '';
	};

	const [tree] = rel.split('/');
	const title = get('title');
	const description = get('description');
	const section = get('section') || tree;
	const order = get('order') || '1';

	// NextUp links are site-relative to its own docs root.
	const linksFixed = body.replace(/\]\(\/docs\/(?!nextup\/)/g, '](/docs/nextup/');

	const frontmatter = [
		'---',
		`title: ${JSON.stringify(title)}`,
		`description: ${JSON.stringify(description)}`,
		`section: ${JSON.stringify(section)}`,
		`order: ${order}`,
		...kept.map((line) => line.trim()),
		'---',
		''
	].join('\n');

	const outPath = join(DEST, rel);
	mkdirSync(join(outPath, '..'), { recursive: true });
	writeFileSync(outPath, `${frontmatter}${linksFixed}`);
	count += 1;
}

// Section labels per NextUp tree, matching its own sidebar wording.
const LABELS = {
	start: 'Getting started',
	floor: 'Floor setup',
	operations: 'Operations',
	admin: 'Team and config',
	connect: 'API and auth',
	events: 'Events and messaging',
	surfaces: 'Floor embedding',
	brand: 'Brand and assets',
	partners: 'Sponsors and partners',
	investors: 'Investors'
};

const SECTION_ORDER = {
	business: ['start', 'floor', 'operations', 'admin'],
	developer: ['start', 'connect', 'events', 'surfaces'],
	brand: ['brand'],
	partners: ['partners'],
	investors: ['investors']
};

/** Mirrors `sectionSlug` in `src/lib/tool/docs/nav.ts`. */
function sectionSlug(section) {
	const slug = section
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return slug ? [slug] : [];
}

const labelFile = join(import.meta.dirname, '..', 'src/lib/tool/docs/folder-labels.ts');
const existing = readFileSync(labelFile, 'utf8');
const current = [...existing.matchAll(/^\t'([^']+)': '([^']*)',?$/gm)].reduce(
	(acc, m) => ({ ...acc, [m[1]]: m[2] }),
	{}
);

/** Folder labels for the tree folder and each section under it. */
const nextupLabels = {};
const nextupOrder = {};
for (const tree of ['business', 'developer', 'brand', 'partners', 'investors']) {
	nextupLabels[`nextup/${tree}`] = tree.charAt(0).toUpperCase() + tree.slice(1);
}

for (const [tree, order] of Object.entries(SECTION_ORDER)) {
	order.forEach((section, index) => {
		const [slug] = sectionSlug(section);
		if (!slug || !LABELS[section]) return;
		// A tree whose only section matches its folder name stays flat.
		const key = slug === tree ? `nextup/${tree}` : `nextup/${tree}/${slug}`;
		nextupLabels[key] = LABELS[section];
		nextupOrder[key] = index;
	});
}

const merged = { ...current, ...nextupLabels };
const rendered = Object.entries(merged)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([k, v]) => `\t'${k}': '${String(v).replace(/'/g, "\\'")}'`)
	.join(',\n');

const renderedOrder = Object.entries(nextupOrder)
	.sort(([, a], [, b]) => a - b)
	.map(([k, v]) => `\t'${k}': ${v}`)
	.join(',\n');

writeFileSync(
	labelFile,
	`/**
 * Sidebar folder labels and order, keyed by posix path under \`content/docs\`.
 * Rewritten by \`scripts/move-nextup-docs.mjs\` and \`scripts/move-medora-docs.mjs\`;
 * hand edits survive only until those scripts run again.
 */
export const FOLDER_LABELS: Record<string, string> = {
${rendered}
};

export const FOLDER_ORDER: Record<string, number> = {
${renderedOrder}
};
`
);

console.log(`nextup docs: ${count} files -> ${DEST}`);
