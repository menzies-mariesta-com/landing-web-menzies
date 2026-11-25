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
	],
	bookOpen: [
		['path', { d: 'M12 5v16', key: '1f6ucr' }],
		[
			'path',
			{
				d: 'M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z',
				key: '1fyvmf'
			}
		]
	],
	stethoscope: [
		['path', { d: 'M11 2v2', key: '153kiw' }],
		['path', { d: 'M5 2v2', key: '1m3gvu' }],
		[
			'path',
			{
				d: 'M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1',
				key: '8zbcm9'
			}
		],
		['path', { d: 'M8 15a6 6 0 0 0 12 0v-3', key: '1kf3m5' }],
		['circle', { cx: '20', cy: '10', r: '2', key: '1h7g24' }]
	],
	ticket: [
		[
			'path',
			{
				d: 'M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z',
				key: '1l4dpu'
			}
		],
		['path', { d: 'M13 5v2', key: '1h6j5o' }],
		['path', { d: 'M13 17v2', key: '1b8g0x' }],
		['path', { d: 'M13 11v2', key: '1q3n0z' }]
	],
	swatchBook: [
		['path', { d: 'M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z', key: '1ldrpk' }],
		['path', { d: 'M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7', key: '11i5po' }],
		['path', { d: 'M 7 17h.01', key: '1euzgo' }],
		[
			'path',
			{
				d: 'm11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8',
				key: 'o2gii7'
			}
		]
	],
	settings2: [
		['path', { d: 'M14 17H5', key: 'gfn3mx' }],
		['path', { d: 'M19 7h-9', key: '6i9tg' }],
		['circle', { cx: '17', cy: '17', r: '3', key: '18b49y' }],
		['circle', { cx: '7', cy: '7', r: '3', key: 'dfmy0x' }]
	],
	codeXml: [
		['path', { d: 'm18 16 4-4-4-4', key: '1inbqp' }],
		['path', { d: 'm6 8-4 4 4 4', key: '15zrgr' }],
		['path', { d: 'm14.5 4-5 16', key: 'e7oirm' }]
	],
	shapes: [
		[
			'path',
			{
				d: 'M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z',
				key: '1bo67w'
			}
		],
		['rect', { x: '3', y: '14', width: '7', height: '7', rx: '1', key: '1bkyp8' }],
		['circle', { cx: '17.5', cy: '17.5', r: '3.5', key: 'w3z12y' }]
	],
	chartLine: [
		['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16', key: 'c24i48' }],
		['path', { d: 'm19 9-5 5-4-4-3 3', key: '2osh9i' }]
	],
	bot: [
		['path', { d: 'M12 8V4H8', key: 'hb8ula' }],
		['rect', { width: '16', height: '12', x: '4', y: '8', rx: '2', key: 'enze0r' }],
		['path', { d: 'M2 14h2', key: 'vft8re' }],
		['path', { d: 'M20 14h2', key: '4cs60a' }],
		['path', { d: 'M15 13v2', key: '1xurst' }],
		['path', { d: 'M9 13v2', key: 'rq6x2g' }]
	],
	rocket: [
		['path', { d: 'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5', key: 'qeys4' }],
		[
			'path',
			{
				d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09',
				key: 'u4xsad'
			}
		],
		[
			'path',
			{
				d: 'M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z',
				key: '676m9'
			}
		],
		['path', { d: 'M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05', key: '92ym6u' }]
	],
	info: [
		['circle', { cx: '12', cy: '12', r: '10', key: '1mglay' }],
		['path', { d: 'M12 16v-4', key: '1dtifu' }],
		['path', { d: 'M12 8h.01', key: 'e9boi3' }]
	],
	triangleAlert: [
		[
			'path',
			{
				d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
				key: 'wmoenq'
			}
		],
		['path', { d: 'M12 9v4', key: 'juzpu7' }],
		['path', { d: 'M12 17h.01', key: 'p32p05' }]
	],
	lightbulb: [
		[
			'path',
			{
				d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
				key: '1gvzjb'
			}
		],
		['path', { d: 'M9 18h6', key: 'x1upvd' }],
		['path', { d: 'M10 22h4', key: 'ceow96' }]
	],
	copy: [
		['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2', key: '17jyea' }],
		['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2', key: 'zix9uf' }]
	]
} as const satisfies Record<string, WashIconNode>;
