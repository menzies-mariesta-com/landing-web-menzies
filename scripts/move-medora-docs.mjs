/**
 * Copies Medora docs into the landing docs tree.
 *
 * Layout follows Medora's own manifest: each workflow lands in a module folder,
 * so the sidebar nests module then screen. Non-workflow content keeps its own
 * folder (guides, roles, templates, releases, legal, patient journal).
 *
 * Run from `landing-web-menzies`: `node scripts/move-medora-docs.mjs`
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const MEDORA = '/home/zarnihlawn/Desktop/medora-web-menzies';
/**
 * `src/lib/docs/content` is removed from Medora now that docs live here, so the
 * script reads a `git archive` snapshot. Create it with:
 *   git archive HEAD src/lib/docs/content src/lib/docs/asset/capture | tar -x -C /tmp/mediasrc
 *   cp src/lib/docs/manifest.json /tmp/mediasrc/manifest.json
 */
const SRC_ROOT = process.env.MEDORA_DOCS_SRC ?? '/tmp/mediasrc';
const SRC_CONTENT = join(SRC_ROOT, 'src/lib/docs/content');
const SRC_MANIFEST = join(SRC_ROOT, 'manifest.json');
const SRC_CAPTURE = join(SRC_ROOT, 'src/lib/docs/asset/capture');
const DEST = join(import.meta.dirname, '..', 'src/content/docs/medora');
const DEST_CAPTURE = join(import.meta.dirname, '..', 'static/docs/capture');

if (!existsSync(SRC_CONTENT)) {
	console.error(
		`Medora docs source missing at ${SRC_CONTENT}.\n` +
			`Run: (cd ~/Desktop/medora-web-menzies && git archive HEAD src/lib/docs/content src/lib/docs/asset/capture | tar -x -C /tmp/mediasrc)`
	);
	process.exit(1);
}

const manifest = JSON.parse(readFileSync(SRC_MANIFEST, 'utf8'));

rmSync(DEST, { recursive: true, force: true });

function walk(dir, out = [], ext = '.md') {
	for (const ent of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, ent.name);
		if (ent.isDirectory()) walk(p, out, ext);
		else if (p.endsWith(ext)) out.push(p);
	}
	return out;
}

function splitFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { meta: {}, body: raw };
	const meta = {};
	for (const line of match[1].split('\n')) {
		const i = line.indexOf(':');
		if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
	}
	return { meta, body: raw.slice(match[0].length) };
}

const moduleNameBySlug = new Map(manifest.modules.map((m) => [m.slug, m.name]));
const workflowBySlug = new Map(manifest.workflows.map((w) => [w.slug, w]));

/**
 * Sidebar order for Medora folders. Non-workflow sections come first so the
 * reader meets "Guides" and "Roles" before the screen-by-screen modules.
 */
const MEDORA_FOLDER_ORDER = {
	guides: 0,
	roles: 1,
	'patient-journal': 2,
	templates: 3,
	releases: 4,
	legal: 5,
	administration: 10,
	registration: 11,
	appointment: 12,
	ambulatory: 13,
	'nursing-workbench': 14,
	clinical: 15,
	consultation: 16,
	medical: 17,
	adt: 18,
	ipd: 19,
	'billing-bill': 20,
	'inventory-setup': 21,
	inventory: 22,
	'medication-order': 23,
	emergency: 24,
	perioperative: 25,
	obstetrics: 26,
	diagnostics: 27
};
const MODULE_TITLES = {
	adt: 'ADT',
	ipd: 'IPD',
	ambulatory: 'Ambulatory',
	clinical: 'Clinical document',
	medical: 'Medical record',
	'billing-bill': 'Billing',
	'nursing-workbench': 'Nursing workbench',
	'inventory-setup': 'Inventory setup',
	'medication-order': 'Medication order'
};

function titleizeModule(slug) {
	return (
		MODULE_TITLES[slug] ??
		slug
			.split('-')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join(' ')
	);
}

/**
 * Medora's workflow slug → module folder. The manifest wins; a prefix guess is
 * only a fallback, and `billing-bill` proves prefixes are unreliable.
 */
const WORKFLOW_MODULE_FALLBACKS = {
	'billing-': 'billing-bill'
};

function moduleForWorkflow(slug) {
	const row = workflowBySlug.get(slug);
	if (row?.moduleSlug) return row.moduleSlug;
	for (const [prefix, moduleSlug] of Object.entries(WORKFLOW_MODULE_FALLBACKS)) {
		if (slug.startsWith(prefix)) return moduleSlug;
	}
	return slug.split('-')[0];
}

/** Medora's workflow slug → [moduleSlug, fileSlug]. */
function workflowTarget(slug) {
	return [moduleForWorkflow(slug), slug];
}

/**
 * Medora's captured docs carry developer-only asides: who the screenshots were
 * taken as, and how to re-seed before a capture run. Readers are hospital staff,
 * so both are removed here rather than hand-edited in 127 files.
 */
function stripDeveloperNotes(body) {
	return body
		.replace(/\s*\(for docs capture we use the seed admin from `\.env`\)/g, '')
		.replace(
			/- \*\*Blank screen:\*\* run `npm run db:seed:demo:docs` for Testing Hospital 1, then open the sub-tab under the section \(for example Document Type under Document Master\)\./g,
			'- **Blank screen:** ask your hospital administrator to check that your account can see this screen, then reload the page.'
		)
		.replace(
			/_Screenshots could not be captured\. Run `npm run db:seed:demo:docs`, start the dev server, then re-run docs capture\._/g,
			'_Screenshots for this screen are not available yet._'
		);
}

/** Rewrites Medora docs links and capture images to the landing paths. */
function rewriteBody(body, moduleSlug) {
	return stripDeveloperNotes(body)
		.replace(/\]\(\/docs\/workflows\/([^)#]+)(#[^)]*)?\)/g, (_, slug, hash = '') => {
			const [mod, fileSlug] = workflowTarget(slug);
			return `](/docs/medora/${mod}/${fileSlug}${hash})`;
		})
		// Medora's old index pages: point at the module folder, or the docs home.
		.replace(/\]\(\/docs\/modules\/([^)]+)\)/g, '](/docs/medora/$1)')
		.replace(/\]\(\/docs\/workflows\)/g, '](/docs/medora/administration)')
		.replace(/\]\(\/docs\/capture\//g, '](/docs/capture/')
		.replace(
			/\]\(\/docs\/(?!medora\/|nextup\/|capture\/|getting-started)([a-z0-9-]+)\/([^)#]+)/g,
			'](/docs/medora/$1/$2'
		)
		.replace(/\]\(\/docs\/(guides|roles|templates|releases|legal|patient-journal)\//g, '](/docs/medora/$1/');
}

let written = 0;
const folderLabels = {};
const folderOrder = {};

function emit(relPath, meta, body) {
	const outPath = join(DEST, relPath);
	mkdirSync(join(outPath, '..'), { recursive: true });
	const frontmatter = [
		'---',
		`title: ${JSON.stringify(meta.title ?? 'Untitled')}`,
		`description: ${JSON.stringify(meta.description ?? '')}`,
		`section: ${JSON.stringify(meta.section ?? '')}`,
		`order: ${Number(meta.order) || 1}`,
		'---',
		''
	].join('\n');
	writeFileSync(outPath, `${frontmatter}${body}`);
	written += 1;
}

/** Workflow screens land directly in their module folder, not under a wrapper. */
manifest.modules.forEach((module, moduleIndex) => {
	folderLabels[`medora/${module.slug}`] = module.name;
	folderOrder[`medora/${module.slug}`] = MEDORA_FOLDER_ORDER[module.slug] ?? 100 + moduleIndex;
});

// Source of truth is the content folder; the manifest only supplies module order
// and titles, and it lags when a capture run writes files it did not list.
const workflowFiles = walk(join(SRC_CONTENT, 'workflows'));
const copiedWorkflows = new Set();

for (const file of workflowFiles) {
	const slug = file.slice(file.lastIndexOf('/') + 1).replace(/\.md$/, '');
	const row = workflowBySlug.get(slug);
	const moduleSlug = moduleForWorkflow(slug);
	const { meta, body } = splitFrontmatter(readFileSync(file, 'utf8'));
	const title = meta.title || row?.title || slug;
	const order = row
		? (manifest.modules.find((m) => m.slug === moduleSlug)?.workflows.indexOf(slug) ?? 0) + 1
		: 1000;
	if (!(moduleSlug in folderLabels)) {
		folderLabels[`medora/${moduleSlug}`] = titleizeModule(moduleSlug);
		folderOrder[`medora/${moduleSlug}`] = MEDORA_FOLDER_ORDER[moduleSlug] ?? 500 + copiedWorkflows.size;
	}
	emit(`${moduleSlug}/${slug}.md`, { ...meta, title, section: '', order }, rewriteBody(body, moduleSlug));
	copiedWorkflows.add(slug);
}

/** Non-workflow content keeps its own folder under `medora/`. */
const SIMPLE_FOLDERS = [
	['guides', 'Guides'],
	['roles', 'Roles'],
	['templates', 'Templates'],
	['patient-journal', 'Patient journal'],
	['releases', 'Releases'],
	['legal', 'Legal']
];

for (const [folder, label] of SIMPLE_FOLDERS) {
	const srcDir = join(SRC_CONTENT, folder);
	let files;
	try {
		files = walk(srcDir);
	} catch {
		continue;
	}
	folderLabels[`medora/${folder}`] = label;
	folderOrder[`medora/${folder}`] = MEDORA_FOLDER_ORDER[folder] ?? 200;

	for (const file of files) {
		const rel = relative(srcDir, file).replace(/\\/g, '/');
		const { meta, body } = splitFrontmatter(readFileSync(file, 'utf8'));
		const name = rel.replace(/\.md$/, '');
		// Keep nested folders (roles/employee, roles/machine) so the sidebar groups them.
		const parent = name.includes('/') ? name.slice(0, name.lastIndexOf('/')) : '';
		if (parent) {
			const path = `medora/${folder}/${parent}`;
			folderLabels[path] ??= parent
				.split('/')
				.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
				.join(' ');
			folderOrder[path] ??= (MEDORA_FOLDER_ORDER[folder] ?? 200) + 0.5;
		}
		emit(
			`${folder}/${name}.md`,
			{ ...meta, title: meta.title || name.split('/').pop(), section: '', order: Number(meta.order) || 1 },
			rewriteBody(body, folder)
		);
	}
}

/** Screenshots referenced by the workflow guides. */
rmSync(DEST_CAPTURE, { recursive: true, force: true });
mkdirSync(DEST_CAPTURE, { recursive: true });
let images = 0;
try {
	for (const file of walk(SRC_CAPTURE, [], '.png')) {
		const rel = relative(SRC_CAPTURE, file);
		mkdirSync(join(DEST_CAPTURE, rel, '..'), { recursive: true });
		copyFileSync(file, join(DEST_CAPTURE, rel));
		images += 1;
	}
} catch {
	console.warn('no capture images directory');
}

/** Merge folder labels/order with the NextUp entries already generated. */
const labelFile = join(import.meta.dirname, '..', 'src/lib/tool/docs/folder-labels.ts');
const existing = readFileSync(labelFile, 'utf8');
const readMap = (source, name) => {
	const block = source.split(`export const ${name}`)[1]?.match(/\{([\s\S]*?)\};/)?.[1] ?? '';
	const out = {};
	for (const m of block.matchAll(/^\t'([^']+)':\s*(.+?),?$/gm)) {
		const raw = m[2].trim();
		// Values are either a quoted label or a bare number.
		if (/^'.*'$/.test(raw)) out[m[1]] = raw.slice(1, -1).replace(/\\'/g, "'");
		else if (raw !== '') out[m[1]] = Number(raw);
	}
	return out;
};

const labels = { ...readMap(existing, 'FOLDER_LABELS'), ...folderLabels };
const orders = { ...readMap(existing, 'FOLDER_ORDER'), ...folderOrder };

const renderMap = (map) =>
	Object.keys(map)
		.sort()
		.map((k) => `\t'${k}': ${typeof map[k] === 'number' ? map[k] : `'${String(map[k]).replace(/'/g, "\\'")}'`}`)
		.join(',\n');

writeFileSync(
	labelFile,
	`/**
 * Sidebar folder labels and order, keyed by posix path under \`content/docs\`.
 * Written by \`scripts/move-nextup-docs.mjs\` and \`scripts/move-medora-docs.mjs\`;
 * hand edits do not survive those scripts.
 */
export const FOLDER_LABELS: Record<string, string> = {
${renderMap(labels)}
};

export const FOLDER_ORDER: Record<string, number> = {
${renderMap(orders)}
};
`
);

console.log(`medora docs: ${written} files, ${images} images`);
