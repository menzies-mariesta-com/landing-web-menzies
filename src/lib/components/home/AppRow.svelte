<script lang="ts">
	import type { StoreRow } from '#lib/tool/store-catalog';
	import AppTile from './AppTile.svelte';

	let { row }: { row: StoreRow } = $props();

	let scroller = $state<HTMLElement | null>(null);

	function scrollBy(dir: -1 | 1) {
		if (!scroller) return;
		const amount = Math.min(scroller.clientWidth * 0.75, 360);
		scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
	}
</script>

<section
	id={`row-${row.id}`}
	class="store-row scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10"
	aria-labelledby={`row-title-${row.id}`}
>
	<div class="mx-auto max-w-6xl">
		<div class="flex items-end justify-between gap-4">
			<div class="min-w-0">
				<h2
					id={`row-title-${row.id}`}
					class="font-display text-xl font-semibold tracking-tight sm:text-2xl"
				>
					{row.title}
				</h2>
				<p class="mt-1 text-sm text-ink-muted">{row.subtitle}</p>
			</div>
			<div class="hidden shrink-0 gap-1 sm:flex">
				<div class="tooltip tooltip-primary" data-tip="Scroll left">
					<button
						type="button"
						class="btn btn-ghost btn-square btn-sm btn-primary cursor-pointer"
						aria-label={`Scroll ${row.title} left`}
						onclick={() => scrollBy(-1)}
					>
						<svg
							class="size-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
					</button>
				</div>
				<div class="tooltip tooltip-primary" data-tip="Scroll right">
					<button
						type="button"
						class="btn btn-ghost btn-square btn-sm btn-primary cursor-pointer"
						aria-label={`Scroll ${row.title} right`}
						onclick={() => scrollBy(1)}
					>
						<svg
							class="size-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<div
			bind:this={scroller}
			class="store-row-scroll mt-5 flex gap-4 overflow-x-auto pb-2 pe-4"
			role="list"
			aria-label={row.title}
		>
			{#each row.apps as app (app.id)}
				<div role="listitem">
					<AppTile {app} />
				</div>
			{/each}
		</div>
	</div>
</section>
