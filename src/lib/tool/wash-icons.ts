/**
 * Lucide icon nodes for Svelte, matching Wash UI's lucide-react 1.28.0 pin
 * (`@menzies-mariesta-com/menzies-design-wash-ui/icons`).
 *
 * Wash re-exports Lucide as React components. Svelte apps render the same
 * `__iconNode` paths via `WashIcon.svelte` instead of `@lucide/svelte`.
 *
 * Nodes are vendored from lucide-react 1.28.0 (Wash transitive) so this app
 * does not need React under `legacy-peer-deps`. Keep in sync when Wash bumps Lucide.
 */
import type { WashIconNode } from '$lib/tool/wash-icon-node';

export type { WashIconNode };

export const washIcons = {
	arrowLeft: [
		['path', { d: 'm12 19-7-7 7-7', key: '1l729n' }],
		['path', { d: 'M19 12H5', key: 'x3x0zl' }]
	],
	arrowRight: [
		['path', { d: 'M5 12h14', key: '1ays0h' }],
		['path', { d: 'm12 5 7 7-7 7', key: 'xquz4c' }]
	],
	check: [['path', { d: 'M20 6 9 17l-5-5', key: '1gmf2c' }]],
	house: [
		['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', key: '5wwlr5' }],
		[
			'path',
			{
				d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
				key: 'r6nss1'
			}
		]
	],
	download: [
		['path', { d: 'M12 15V3', key: 'm9g1x1' }],
		['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', key: 'ih7n3h' }],
		['path', { d: 'm7 10 5 5 5-5', key: 'brsn70' }]
	],
	mail: [
		['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7', key: '132q7q' }],
		['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2', key: 'izxlao' }]
	],
	menu: [
		['path', { d: 'M4 5h16', key: '1tepv9' }],
		['path', { d: 'M4 12h16', key: '1lakjw' }],
		['path', { d: 'M4 19h16', key: '1djgab' }]
	],
	moon: [
		[
			'path',
			{
				d: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401',
				key: 'kfwtm'
			}
		]
	],
	search: [
		['path', { d: 'm21 21-4.34-4.34', key: '14j7rj' }],
		['circle', { cx: '11', cy: '11', r: '8', key: '4ej97u' }]
	],
	palette: [
		[
			'path',
			{
				d: 'M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z',
				key: 'e79jfc'
			}
		],
		['circle', { cx: '13.5', cy: '6.5', r: '.5', fill: 'currentColor', key: '1okk4w' }],
		['circle', { cx: '17.5', cy: '10.5', r: '.5', fill: 'currentColor', key: 'f64h9f' }],
		['circle', { cx: '6.5', cy: '12.5', r: '.5', fill: 'currentColor', key: 'qy21gx' }],
		['circle', { cx: '8.5', cy: '7.5', r: '.5', fill: 'currentColor', key: 'fotxhn' }]
	],
	sun: [
		['circle', { cx: '12', cy: '12', r: '4', key: '4exip2' }],
		['path', { d: 'M12 2v2', key: 'tus03m' }],
		['path', { d: 'M12 20v2', key: '1lh1kg' }],
		['path', { d: 'm4.93 4.93 1.41 1.41', key: '149t6j' }],
		['path', { d: 'm17.66 17.66 1.41 1.41', key: 'ptbguv' }],
		['path', { d: 'M2 12h2', key: '1t8f8n' }],
		['path', { d: 'M20 12h2', key: '1q8mjw' }],
		['path', { d: 'm6.34 17.66-1.41 1.41', key: '1m8zz5' }],
		['path', { d: 'm19.07 4.93-1.41 1.41', key: '1shlcs' }]
	],
	x: [
		['path', { d: 'M18 6 6 18', key: '1bl5f8' }],
		['path', { d: 'm6 6 12 12', key: 'd8bk6v' }]
	]
} as const satisfies Record<string, WashIconNode>;
