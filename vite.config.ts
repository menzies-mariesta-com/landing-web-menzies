import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-netlify';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	server: {
		port: 4004,
		host: true,
		strictPort: true,
		// Avoid SSR reload storms when a parallel `vite build` writes into ./build
		// or adapter output. Do NOT ignore all of `.svelte-kit`: generated route
		// nodes under `generated/dev/client/nodes` must invalidate on route adds,
		// or the client keeps stale page modules after route adds/removes.
		watch: {
			ignored: ['**/build/**', '**/.netlify/**', '**/.svelte-kit/output/**']
		}
	},
	preview: {
		port: 4004,
		host: true,
		strictPort: true
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			alias: { $lib: 'src/lib' },
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			adapter: adapter(),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md'],
			experimental: { remoteFunctions: true },
			// Absolute canonical / OG URLs in prerendered HTML (not http://sveltekit-prerender).
			paths: {
				origin: 'https://store.menzies.design'
			}
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// Keep CLI (`npm run paraglide`) and Vite plugin on the same layout so
			// hot recompile never briefly drops locale files (e.g. my.js) mid-SSR.
			outputStructure: 'message-modules',
			// Cookie + localStorage so locale survives when cookies are restricted.
			strategy: ['cookie', 'localStorage', 'baseLocale']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
