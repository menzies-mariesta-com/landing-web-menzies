<script lang="ts">
	import MenziesLogoFlap from '$lib/components/home/MenziesLogoFlap.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<section
	class="store-hero flex items-center px-4 py-10 sm:px-6 sm:py-12 lg:py-14"
	aria-labelledby="store-hero-title"
>
	<div
		class="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:gap-14"
	>
		<div class="max-w-xl md:max-w-2xl">
			<p class="font-display text-sm font-medium tracking-wide text-primary">{m.hero_eyebrow()}</p>
			<h1
				id="store-hero-title"
				class="font-display mt-2 text-4xl font-semibold tracking-tight text-base-content sm:text-5xl"
			>
				{m.hero_title()}
			</h1>
			<p class="mt-3 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
				{m.hero_blurb()}
			</p>
			<div class="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
				<a href="/plans" class="btn btn-primary cursor-pointer">{m.hero_cta_plans()}</a>
				<a href="/apps" class="btn btn-ghost cursor-pointer">{m.hero_cta_apps()}</a>
			</div>
		</div>

		<div class="flex justify-center md:justify-end">
			<MenziesLogoFlap />
		</div>
	</div>
</section>
