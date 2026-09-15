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

<a
	id={`app-${app.id}`}
	href={`#app-${app.id}`}
	class="store-tile flex w-40 shrink-0 flex-col gap-3 scroll-mt-24 cursor-pointer sm:w-44"
>
	<div
		class={`flex aspect-square w-full items-center justify-center rounded-box font-display text-3xl font-semibold sm:text-4xl ${accentClass[app.accent]}`}
		aria-hidden="true"
	>
		{app.mark}
	</div>
	<div class="min-w-0">
		<p class="truncate font-medium text-base-content">{app.name}</p>
		<p class="truncate text-sm text-ink-muted">{app.categoryLabel}</p>
		<p class="mt-1 inline-flex items-center gap-1 text-sm text-ink-muted">
			<svg
				class="size-3.5 fill-warning text-warning"
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
			{app.rating.toFixed(1)}
		</p>
	</div>
</a>
