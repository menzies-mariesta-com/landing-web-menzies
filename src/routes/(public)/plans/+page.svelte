<script lang="ts">
	import { page } from '$app/state';
	import CatalogSearch from '$lib/components/catalog/CatalogSearch.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import { MENZIES_PLANS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
	import {
		breadcrumbJsonLd,
		buildSeo,
		collectionPageJsonLd
	} from '$lib/util/seo';

	let query = $state('');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return MENZIES_PLANS;
		return MENZIES_PLANS.filter((plan) => {
			const hay = `${plan.name} ${plan.kind} ${plan.description}`.toLowerCase();
			return hay.includes(q);
		});
	});

	const seo = $derived(
		buildSeo({
			title: m.plans_seo_title(),
			description: m.plans_seo_description(),
			path: '/plans',
			url: page.url,
			type: 'website',
			jsonLd: [
				collectionPageJsonLd({
					name: m.plans_page_title(),
					description: m.plans_seo_description(),
					path: '/plans',
					url: page.url
				}),
				breadcrumbJsonLd(
					[
						{ name: 'Home', path: '/' },
						{ name: m.plans_page_title(), path: '/plans' }
					],
					page.url
				)
			]
		})
	);
</script>

<SeoHead {seo} />

<div class="store-plans">
	<StoreNav />
	<main class="px-4 py-12 sm:px-6 sm:py-16">
		<div class="mx-auto max-w-6xl">
			<div
				class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
			>
				<h1 class="font-display shrink-0 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
					{m.plans_page_title()}
				</h1>
				<div class="flex w-full sm:max-w-md sm:flex-1 sm:justify-end md:max-w-xl">
					<CatalogSearch
						bind:value={query}
						placeholder={m.catalog_search_placeholder()}
						label={m.catalog_search_label()}
					/>
				</div>
			</div>

			{#if filtered.length === 0}
				<p class="mt-8 text-sm text-ink-muted" role="status">{m.catalog_search_empty()}</p>
			{:else}
				<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each filtered as plan (plan.id)}
						<li
							id={`plan-${plan.id}`}
							class="flex h-full scroll-mt-24 flex-col rounded-box border border-ink-border/70 p-6 sm:p-8"
						>
							<img
								src={plan.logoSrc}
								alt={`${plan.name} logo`}
								width="48"
								height="48"
								class="size-12 shrink-0 rounded-box object-contain"
								decoding="async"
								loading="lazy"
							/>
							<p class="mt-4 text-sm text-ink-muted">{plan.kind}</p>
							<h2 class="font-display mt-1 text-xl font-semibold tracking-tight">
								{plan.name}
							</h2>
							<p class="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
								{plan.description}
							</p>
							<a
								href={plan.ctaHref}
								target={plan.ctaHref.startsWith('http') ? '_blank' : undefined}
								rel={plan.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
								class="btn btn-outline mt-6 cursor-pointer"
							>
								{plan.ctaLabel}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</main>
	<StoreFooter />
</div>
