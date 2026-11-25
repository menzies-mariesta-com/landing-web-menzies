<script lang="ts">
	import DocsBreadcrumbs from '$lib/components/docs/DocsBreadcrumbs.svelte';
	import DocsToc from '$lib/components/docs/DocsToc.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import CodeCopyEnhance from '$lib/components/docs/CodeCopyEnhance.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getDocModule } from '$lib/tool/docs/nav';
	import { collectToc, observeActiveHeading } from '$lib/tool/docs/toc';
	import { breadcrumbJsonLd, buildSeo, webPageJsonLd } from '$lib/util/seo';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import type { TocItem } from '$lib/tool/docs/types';

	let { data } = $props();

	const Doc = $derived(
		getDocModule(data.slug)?.default as typeof import('svelte').SvelteComponent | undefined
	);

	let articleEl = $state<HTMLElement | null>(null);
	let tocItems = $state<TocItem[]>([]);
	let activeId = $state<string | null>(null);
	/** While set, scroll-spy must not overwrite a TOC click selection. */
	let pinnedId = $state<string | null>(null);
	let pinTimer: ReturnType<typeof setTimeout> | undefined;

	function selectTocHeading(id: string) {
		activeId = id;
		pinnedId = id;
		if (pinTimer) clearTimeout(pinTimer);
		pinTimer = setTimeout(() => {
			pinnedId = null;
		}, 900);
	}

	$effect(() => {
		data.slug;
		queueMicrotask(() => {
			tocItems = collectToc(articleEl);
		});
	});

	$effect(() => {
		data.slug;
		pinnedId = null;
		if (pinTimer) clearTimeout(pinTimer);
		return observeActiveHeading(articleEl, (id) => {
			if (pinnedId) return;
			activeId = id;
		});
	});

	/** A folder index has no page of its own, so it borrows a neutral title. */
	const pageTitle = $derived(data.doc?.title ?? data.folder?.title ?? m.docs_chrome_title());
	const pageDescription = $derived(data.doc?.description ?? '');
	const pageHref = $derived(data.doc?.href ?? `/docs/${data.slug}`);

	const seo = $derived(
		buildSeo({
			title: pageTitle,
			description: pageDescription,
			url: page.url,
			path: pageHref,
			type: 'article',
			jsonLd: [
				webPageJsonLd({
					name: pageTitle,
					description: pageDescription,
					path: pageHref,
					url: page.url
				}),
				breadcrumbJsonLd(
					[
						{ name: m.brand_menzies(), path: '/' },
						{ name: m.docs_chrome_title(), path: '/docs/getting-started' },
						{ name: pageTitle, path: pageHref }
					],
					page.url
				)
			]
		})
	);

	const crumbs = $derived([
		{ href: '/', label: m.brand_menzies() },
		{ href: '/docs/getting-started', label: m.docs_chrome_title() },
		{ href: pageHref, label: pageTitle }
	]);
</script>

<SeoHead {seo} />

<div class="flex w-full">
	<div class="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
		<DocsBreadcrumbs items={crumbs} />
		<p class="text-primary mt-4 text-xs font-semibold tracking-wide uppercase">
			{data.sectionLabel}
		</p>

		<article class="docs-prose mt-2" bind:this={articleEl}>
			{#if data.doc?.tree === 'medora'}
				<!-- Medora workflow pages start at h2; NextUp pages carry their own h1. -->
				<h1>{data.doc.title}</h1>
			{/if}
			{#if Doc}
				<Doc />
			{:else if data.folder}
				<h1>{data.folder.title}</h1>
				<ul class="not-prose mt-6 grid gap-3 sm:grid-cols-2">
					{#each data.folder.pages as page (page.href)}
						<li>
							<a
								href={page.href}
								class="rounded-box border-ink-border/70 hover:bg-primary/5 hover:border-primary/50 block h-full border p-4 no-underline"
							>
								<span class="block font-medium">{page.title}</span>
								{#if page.description}
									<span class="text-ink-muted mt-1 block text-sm leading-relaxed">
										{page.description}
									</span>
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</article>

		<CodeCopyEnhance root={articleEl} />
		<DocsPrevNext prev={data.prev} next={data.next} />
	</div>

	<aside
		class="sticky top-16 hidden h-[calc(100dvh-4rem)] w-56 shrink-0 overflow-y-auto scroll-smooth pe-5 pt-3 pb-6 xl:block"
	>
		<DocsToc items={tocItems} {activeId} onSelect={selectTocHeading} />
	</aside>
</div>
