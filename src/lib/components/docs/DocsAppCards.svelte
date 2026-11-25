<script lang="ts">
	import { MENZIES_APPS, MENZIES_LIBRARY, MENZIES_PLANS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';

	type Card = {
		id: string;
		name: string;
		kind: string;
		summary: string;
		logoSrc: string;
		href: string;
		/** Present when the app has its own documentation tree. */
		docsHref?: string;
	};

	const apps: Card[] = MENZIES_APPS.map((app) => ({
		id: app.id,
		name: app.name,
		kind: app.kind,
		summary: app.tagline,
		logoSrc: app.iconSrc,
		href: app.githubUrl
	}));

	const services: Card[] = MENZIES_PLANS.map((plan) => ({
		id: plan.id,
		name: plan.name,
		kind: plan.kind,
		summary: plan.description,
		logoSrc: plan.logoSrc,
		href: plan.ctaHref,
		docsHref:
			plan.id === 'medora' ? '/docs/medora' : plan.id === 'nextup' ? '/docs/nextup' : undefined
	}));

	const library: Card[] = MENZIES_LIBRARY.map((item) => ({
		id: item.id,
		name: item.name,
		kind: item.kind,
		summary: item.tagline,
		logoSrc: item.logoSrc,
		href: item.ctaHref
	}));

	const groups = [
		{ id: 'services', title: m.docs_cards_services(), cards: services },
		{ id: 'desktop', title: m.docs_cards_desktop(), cards: apps },
		{ id: 'library', title: m.docs_cards_library(), cards: library }
	];
</script>

{#each groups as group (group.id)}
	{#if group.cards.length > 0}
		<section class="mt-8" aria-labelledby={`card-group-${group.id}`}>
			<h2 id={`card-group-${group.id}`} class="font-display text-xl font-semibold">
				{group.title}
			</h2>
			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each group.cards as card (card.id)}
					<li class="rounded-box border-ink-border/70 flex h-full flex-col gap-3 border p-4">
						<div class="flex items-center gap-3">
							<img
								src={card.logoSrc}
								alt=""
								width="40"
								height="40"
								class="rounded-box size-10 shrink-0"
								decoding="async"
								loading="lazy"
							/>
							<div class="min-w-0">
								<p class="font-medium">{card.name}</p>
								<p class="text-ink-muted text-sm">{card.kind}</p>
							</div>
						</div>
						<p class="text-ink-muted flex-1 text-sm leading-relaxed">{card.summary}</p>
						<div class="flex flex-wrap items-center gap-3">
							{#if card.docsHref}
								<a href={card.docsHref} class="btn btn-primary btn-sm ripple cursor-pointer">
									{m.docs_cards_read_docs()}
								</a>
							{/if}
							<a href={card.href} class="btn btn-ghost btn-sm ripple cursor-pointer" rel="noopener">
								{m.docs_cards_learn_more()}
							</a>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
{/each}
