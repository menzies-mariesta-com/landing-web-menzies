<script lang="ts">
	import SectionViewMore from '$lib/components/home/SectionViewMore.svelte';
	import { MENZIES_LIBRARY } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
</script>

<section
	id="library"
	class="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16"
	aria-labelledby="library-title"
>
	<div class="mx-auto max-w-6xl">
		<SectionViewMore id="library-title" title={m.library_title()} href="/library" />

		<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each MENZIES_LIBRARY as item (item.id)}
				<li
					id={`library-${item.id}`}
					class="flex h-full flex-col rounded-box border border-ink-border/70 p-6 sm:p-8"
				>
					<img
						src={item.logoSrc}
						alt={`${item.name} logo`}
						width="48"
						height="48"
						class="size-12 shrink-0 rounded-box"
						decoding="async"
						loading="lazy"
					/>
					<p class="mt-4 text-sm text-ink-muted">{item.kind}</p>
					<h3 class="font-display mt-1 text-xl font-semibold tracking-tight">
						{item.name}
					</h3>
					{#if item.version}
						<p class="mt-1 text-xs text-ink-muted">v{item.version}</p>
					{/if}
					<p class="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{item.tagline}</p>
					<div class="mt-6 flex flex-wrap gap-2">
						<a
							href={item.ctaHref}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-primary cursor-pointer"
						>
							{item.ctaLabel}
						</a>
						{#if item.secondaryCtaHref && item.secondaryCtaLabel}
							<a
								href={item.secondaryCtaHref}
								target="_blank"
								rel="noopener noreferrer"
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
