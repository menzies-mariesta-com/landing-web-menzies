<script lang="ts">
	import BrandIcon from '$lib/components/BrandIcon.svelte';
	import SectionViewMore from '$lib/components/home/SectionViewMore.svelte';
	import { MENZIES_EXTENSIONS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
</script>

<section
	id="extensions"
	class="scroll-mt-20 px-4 py-8 sm:px-6 sm:py-12"
	aria-labelledby="extensions-title"
>
	<div class="mx-auto max-w-6xl">
		<SectionViewMore
			id="extensions-title"
			title={m.extensions_section_title()}
			href="/extensions"
		/>

		<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each MENZIES_EXTENSIONS as item (item.id)}
				<li
					id={`extension-${item.id}`}
					class="rounded-box border-ink-border/70 flex h-full flex-col border p-6 sm:p-8"
				>
					{#if item.iconSlug}
						<BrandIcon slug={item.iconSlug} class="size-12" title={item.name} />
					{:else if item.logoSrc}
						<img
							src={item.logoSrc}
							alt={`${item.name} icon`}
							width="48"
							height="48"
							class="rounded-box size-12 shrink-0 object-contain"
							decoding="async"
							loading="lazy"
						/>
					{/if}
					<p class="text-ink-muted mt-4 text-sm">{item.kind}</p>
					<h3 class="font-display mt-1 text-xl font-semibold tracking-tight">
						{item.name}
					</h3>
					{#if item.version}
						<p class="text-ink-muted mt-1 text-xs">v{item.version}</p>
					{/if}
					<p class="text-ink-muted mt-2 flex-1 text-sm leading-relaxed">
						{item.id === 'face-recognition' ? m.extensions_face_tagline() : item.tagline}
					</p>
					<div class="mt-6 flex flex-wrap gap-2">
						<a
							href={item.ctaHref}
							target={item.ctaHref.startsWith('http') ? '_blank' : undefined}
							rel={item.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
							class="btn btn-primary cursor-pointer"
						>
							{item.ctaLabel}
						</a>
						{#if item.secondaryCtaHref && item.secondaryCtaLabel}
							<a
								href={item.secondaryCtaHref}
								target={item.secondaryCtaHref.startsWith('http') ? '_blank' : undefined}
								rel={item.secondaryCtaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
								class="btn btn-ghost cursor-pointer"
							>
								{item.secondaryCtaLabel}
							</a>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>
