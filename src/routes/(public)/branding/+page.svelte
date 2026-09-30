<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/asset/image/logo.svg';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';
	import { breadcrumbJsonLd, buildSeo, webPageJsonLd } from '$lib/util/seo';

	const seo = $derived(
		buildSeo({
			title: m.branding_seo_title(),
			description: m.branding_seo_description(),
			path: '/branding',
			url: page.url,
			type: 'website',
			jsonLd: [
				webPageJsonLd({
					name: m.branding_title(),
					description: m.branding_seo_description(),
					path: '/branding',
					url: page.url
				}),
				breadcrumbJsonLd(
					[
						{ name: 'Home', path: '/' },
						{ name: m.branding_title(), path: '/branding' }
					],
					page.url
				)
			]
		})
	);
</script>

<SeoHead {seo} />

<div class="store-branding">
	<StoreNav />
	<main class="px-4 py-12 sm:px-6 sm:py-16">
		<div class="mx-auto max-w-3xl">
			<p class="font-display text-sm font-medium tracking-wide text-primary">
				{m.brand_menzies()}
			</p>
			<h1 class="font-display mt-2 text-4xl font-semibold tracking-tight text-base-content sm:text-5xl">
				{m.branding_title()}
			</h1>
			<p class="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
				{m.branding_intro()}
			</p>
		</div>

		<!-- Logo -->
		<section class="mx-auto mt-16 max-w-3xl" aria-labelledby="branding-logo">
			<h2
				id="branding-logo"
				class="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
			>
				{m.branding_logo_title()}
			</h2>
			<p class="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
				{m.branding_logo_blurb()}
			</p>

			<figure class="mt-8 flex flex-col items-center gap-4">
				<div
					class="flex items-center justify-center border border-dashed border-ink-border/80 p-[12.5%] bg-base-100"
					aria-hidden="true"
				>
					<img src={logo} alt="" width="120" height="120" class="size-28 sm:size-32" />
				</div>
				<figcaption class="text-center text-sm text-ink-muted">
					{m.branding_logo_clear_space()}
				</figcaption>
			</figure>
			<p class="mt-3 text-sm leading-relaxed text-ink-muted">
				{m.branding_logo_clear_space_blurb()}
			</p>

			<div class="mt-10 grid gap-8 sm:grid-cols-2">
				<div>
					<p class="flex items-center gap-2 text-sm font-medium text-success">
						<WashIcon icon={washIcons.check} class="size-4 shrink-0" />
						{m.branding_logo_do()}
					</p>
					<ul class="mt-3 space-y-3 text-sm text-ink-muted">
						<li class="flex items-start gap-3">
							<img
								src={logo}
								alt=""
								width="40"
								height="40"
								class="mt-0.5 size-10 shrink-0"
								aria-hidden="true"
							/>
							<span>{m.branding_logo_do_keep_ratio()}</span>
						</li>
						<li>{m.branding_logo_do_use_svg()}</li>
					</ul>
				</div>
				<div>
					<p class="flex items-center gap-2 text-sm font-medium text-error">
						<WashIcon icon={washIcons.x} class="size-4 shrink-0" />
						{m.branding_logo_dont()}
					</p>
					<ul class="mt-3 space-y-3 text-sm text-ink-muted">
						<li class="flex items-start gap-3">
							<img
								src={logo}
								alt=""
								width="64"
								height="40"
								class="mt-0.5 h-10 w-16 shrink-0 opacity-80"
								aria-hidden="true"
							/>
							<span>{m.branding_logo_dont_stretch()}</span>
						</li>
						<li class="flex items-start gap-3">
							<img
								src={logo}
								alt=""
								width="40"
								height="40"
								class="mt-0.5 size-10 shrink-0 hue-rotate-90 saturate-150"
								aria-hidden="true"
							/>
							<span>{m.branding_logo_dont_recolor()}</span>
						</li>
					</ul>
				</div>
			</div>

			<p class="mt-8">
				<a
					href="/logo.svg"
					download="menzies-logo.svg"
					class="btn btn-primary cursor-pointer gap-2"
				>
					<WashIcon icon={washIcons.download} class="size-4" />
					{m.branding_logo_download()}
				</a>
			</p>
		</section>

		<!-- Wordmark -->
		<section class="mx-auto mt-20 max-w-3xl" aria-labelledby="branding-wordmark">
			<h2
				id="branding-wordmark"
				class="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
			>
				{m.branding_wordmark_title()}
			</h2>
			<p class="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
				{m.branding_wordmark_blurb()}
			</p>
			<p class="font-display mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
				{m.brand_menzies()}
			</p>
			<p class="mt-2 font-display text-lg font-medium tracking-tight text-ink-muted">
				{m.hero_title()}
			</p>
		</section>

		<!-- Typography -->
		<section class="mx-auto mt-20 max-w-3xl" aria-labelledby="branding-type">
			<h2
				id="branding-type"
				class="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
			>
				{m.branding_type_title()}
			</h2>
			<p class="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
				{m.branding_type_blurb()}
			</p>

			<div class="mt-10 space-y-10">
				<div>
					<p class="text-sm font-medium text-base-content">{m.branding_type_display()}</p>
					<p class="mt-1 text-sm text-ink-muted">{m.branding_type_display_blurb()}</p>
					<p class="font-display mt-4 text-4xl font-semibold tracking-tight">
						{m.brand_menzies()}
					</p>
					<p class="font-display mt-2 text-2xl font-medium tracking-tight text-ink-muted">
						Software worth opening
					</p>
					<p class="font-display mt-2 text-lg tracking-tight text-ink-muted">
						Aa Bb Cc 123 · Fraunces 500 / 600 / 700
					</p>
				</div>
				<div>
					<p class="text-sm font-medium text-base-content">{m.branding_type_body()}</p>
					<p class="mt-1 text-sm text-ink-muted">{m.branding_type_body_blurb()}</p>
					<p class="mt-4 text-base leading-relaxed">
						Web service plans, desktop apps, and the Wash UI design library.
					</p>
					<p class="mt-2 font-mono text-sm text-ink-muted">
						Aa Bb Cc 123 · Maple Mono 400 / 500 / 600 / 700
					</p>
				</div>
			</div>
		</section>
	</main>
	<StoreFooter />
</div>
