<script lang="ts">
	import type { StoreApp } from '#lib/tool/store-catalog';

	let { app }: { app: StoreApp } = $props();

	const accentClass: Record<StoreApp['accent'], string> = {
		primary: 'bg-primary text-primary-content',
		secondary: 'bg-secondary text-secondary-content',
		accent: 'bg-accent text-accent-content',
		info: 'bg-info text-info-content',
		success: 'bg-success text-success-content',
		warning: 'bg-warning text-warning-content'
	};
</script>

<section class="store-featured px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="featured-title">
	<div class="mx-auto max-w-6xl">
		<p class="text-sm font-medium tracking-wide text-primary">Today</p>
		<div class="mt-4 rounded-box border border-ink-border p-6 sm:p-8">
			<div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
				<div class="min-w-0">
					<p class="text-sm font-medium text-ink-muted">Featured app</p>
					<h2
						id="featured-title"
						class="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
					>
						{app.name}
					</h2>
					<p class="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
						{app.featuredBlurb ?? app.tagline}
					</p>
					<div class="mt-6 flex flex-wrap items-center gap-4">
						<span class="inline-flex items-center gap-1.5 text-sm text-base-content">
							<svg
								class="size-4 fill-warning text-warning"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<path
									d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
								/>
							</svg>
							<span class="font-medium">{app.rating.toFixed(1)}</span>
							<span class="text-ink-muted">{app.categoryLabel}</span>
						</span>
						<a href={`#app-${app.id}`} class="btn btn-primary cursor-pointer">View app</a>
					</div>
				</div>

				<div
					class={`flex size-24 items-center justify-center rounded-box font-display text-4xl font-semibold sm:size-28 sm:text-5xl ${accentClass[app.accent]}`}
					aria-hidden="true"
				>
					{app.mark}
				</div>
			</div>
		</div>
	</div>
</section>
