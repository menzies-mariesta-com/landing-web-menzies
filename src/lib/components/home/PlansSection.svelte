<script lang="ts">
	import SectionViewMore from '$lib/components/home/SectionViewMore.svelte';
	import { MENZIES_PLANS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
</script>

<section
	id="plans"
	class="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16"
	aria-labelledby="plans-title"
>
	<div class="mx-auto max-w-6xl">
		<SectionViewMore id="plans-title" title={m.plans_title()} href="/plans" />

		<ul class="mt-8 grid gap-4 lg:grid-cols-3">
			{#each MENZIES_PLANS as plan (plan.id)}
				<li
					id={`plan-${plan.id}`}
					class="flex h-full flex-col rounded-box border border-ink-border/70 p-6 sm:p-8"
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
					<h3 class="font-display mt-1 text-xl font-semibold tracking-tight">
						{plan.name}
					</h3>
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
	</div>
</section>
