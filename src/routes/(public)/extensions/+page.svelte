<script lang="ts">
	import { page } from '$app/state';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import { m } from '$lib/paraglide/messages';
	import {
		EXTENSION_KEY_ID,
		PUBLISHER_KEY_PATH,
		REGISTRY_PATH
	} from '$lib/tool/extension-registry';
	import { breadcrumbJsonLd, buildSeo, webPageJsonLd } from '$lib/util/seo';

	let { data } = $props();

	const seo = $derived(
		buildSeo({
			title: m.extensions_seo_title(),
			description: m.extensions_seo_description(),
			path: '/extensions',
			url: page.url,
			type: 'website',
			jsonLd: [
				webPageJsonLd({
					name: m.extensions_title(),
					description: m.extensions_seo_description(),
					path: '/extensions',
					url: page.url
				}),
				breadcrumbJsonLd(
					[
						{ name: 'Home', path: '/' },
						{ name: m.extensions_title(), path: '/extensions' }
					],
					page.url
				)
			]
		})
	);
</script>

<SeoHead {seo} />

<div class="store-extensions">
	<StoreNav />
	<main class="px-4 py-12 sm:px-6 sm:py-16">
		<div class="mx-auto max-w-3xl">
			<p class="font-display text-primary text-sm font-medium tracking-wide">{m.brand_menzies()}</p>
			<h1
				class="font-display text-base-content mt-2 text-4xl font-semibold tracking-tight sm:text-5xl"
			>
				{m.extensions_title()}
			</h1>
			<p class="text-ink-muted mt-4 text-base leading-relaxed sm:text-lg">{m.extensions_intro()}</p>
		</div>

		<section class="mx-auto mt-14 max-w-3xl" aria-labelledby="extensions-privacy">
			<h2
				id="extensions-privacy"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_privacy_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_privacy_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-offline">
			<h2
				id="extensions-offline"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_offline_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_offline_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-updates">
			<h2
				id="extensions-updates"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_updates_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_updates_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-platforms">
			<h2
				id="extensions-platforms"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_platforms_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_platforms_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-install">
			<h2
				id="extensions-install"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_install_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_install_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-face">
			<h2
				id="extensions-face"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_face_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_face_body({
					version: data.faceVersion,
					target: data.faceTarget,
					size: data.faceSize
				})}
			</p>
			<dl class="mt-4 grid gap-2 text-sm sm:grid-cols-3">
				<div>
					<dt class="text-base-content font-medium">{m.extensions_face_title()}</dt>
					<dd class="text-ink-muted font-mono">{data.faceVersion}</dd>
				</div>
				<div>
					<dt class="text-base-content font-medium">{m.extensions_platforms_title()}</dt>
					<dd class="text-ink-muted font-mono">{data.faceTarget}</dd>
				</div>
				<div>
					<dt class="text-base-content font-medium">{m.extensions_download_label()}</dt>
					<dd class="text-ink-muted font-mono">{data.faceSize}</dd>
				</div>
			</dl>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-models">
			<h2
				id="extensions-models"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_models_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_models_body()}
			</p>
		</section>

		<section class="mx-auto mt-12 max-w-3xl" aria-labelledby="extensions-registry">
			<h2
				id="extensions-registry"
				class="font-display text-primary text-2xl font-semibold tracking-tight sm:text-3xl"
			>
				{m.extensions_registry_title()}
			</h2>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed sm:text-base">
				{m.extensions_registry_body({ keyId: EXTENSION_KEY_ID })}
			</p>
			<p class="text-ink-muted mt-3 text-sm leading-relaxed">{m.extensions_catalog_address()}</p>
			<ul class="mt-4 space-y-2 text-sm">
				<li>
					<a
						href="https://menzies.mariesta.com/extensions/registry.json"
						class="text-primary cursor-pointer font-mono underline-offset-2 hover:underline"
						>https://menzies.mariesta.com/extensions/registry.json</a
					>
				</li>
				<li>
					<a
						href="https://menzies.mariesta.com/extensions/publisher-key.json"
						class="text-primary cursor-pointer font-mono underline-offset-2 hover:underline"
						>https://menzies.mariesta.com/extensions/publisher-key.json</a
					>
				</li>
			</ul>
			<ul class="mt-4 space-y-2 text-sm">
				<li>
					<a
						href={REGISTRY_PATH}
						class="text-primary cursor-pointer underline-offset-2 hover:underline"
						>{m.extensions_registry_link()}</a
					>
				</li>
				<li>
					<a
						href={PUBLISHER_KEY_PATH}
						class="text-primary cursor-pointer underline-offset-2 hover:underline"
						>{m.extensions_key_link()}</a
					>
				</li>
			</ul>
		</section>
	</main>
	<StoreFooter />
</div>
