<script lang="ts">
	import { STORE_CATEGORIES } from '#lib/tool/store-catalog';
</script>

<footer class="border-t border-ink-border/60 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
		<div class="sm:col-span-2 lg:col-span-1">
			<p class="font-display text-lg font-semibold tracking-tight">Menzies</p>
			<p class="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
				Software worth opening. Curated apps for work and craft.
			</p>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">Categories</p>
			<ul class="mt-3 space-y-2">
				{#each STORE_CATEGORIES as cat (cat.id)}
					<li>
						<a
							href={`#row-${cat.id}`}
							class="text-sm text-ink-muted cursor-pointer hover:text-primary"
						>
							{cat.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">Store</p>
			<ul class="mt-3 space-y-2">
				<li>
					<a href="#platform" class="text-sm text-ink-muted cursor-pointer hover:text-primary"
						>About</a
					>
				</li>
				<li>
					<a href="#catalog" class="text-sm text-ink-muted cursor-pointer hover:text-primary"
						>Browse</a
					>
				</li>
			</ul>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">Legal</p>
			<ul class="mt-3 space-y-2">
				<li>
					<span class="text-sm text-ink-muted">Privacy (soon)</span>
				</li>
				<li>
					<span class="text-sm text-ink-muted">Terms (soon)</span>
				</li>
			</ul>
		</div>
	</div>

	<p class="mx-auto mt-10 max-w-6xl text-xs text-ink-muted">
		© {new Date().getFullYear()} Menzies. Built with Wash UI.
	</p>
</footer>
