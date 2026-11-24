<script lang="ts">
	import type { DocNavItem } from '$lib/tool/docs/types';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';

	let {
		prev,
		next
	}: {
		prev: DocNavItem | null;
		next: DocNavItem | null;
	} = $props();
</script>

{#if prev || next}
	<nav
		class="border-ink-border/80 mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
		aria-label="Adjacent pages"
	>
		{#if prev}
			<a
				href={prev.href}
				class="group rounded-box border-ink-border/80 bg-base-100/60 hover:bg-primary/20 flex cursor-pointer flex-col gap-1 border px-4 py-3 transition-colors sm:max-w-[48%]"
			>
				<span class="text-ink-muted flex items-center gap-1 text-xs">
					<WashIcon icon={washIcons.arrowLeft} class="size-3.5" title={undefined} />
					{m.docs_prev()}
				</span>
				<span class="group-hover:text-primary font-medium">{prev.title}</span>
			</a>
		{:else}
			<span class="hidden sm:block sm:max-w-[48%]"></span>
		{/if}
		{#if next}
			<a
				href={next.href}
				class="group rounded-box border-ink-border/80 bg-base-100/60 hover:bg-primary/20 flex cursor-pointer flex-col gap-1 border px-4 py-3 text-end transition-colors sm:ms-auto sm:max-w-[48%]"
			>
				<span class="text-ink-muted flex items-center justify-end gap-1 text-xs">
					{m.docs_next()}
					<WashIcon icon={washIcons.arrowRight} class="size-3.5" title={undefined} />
				</span>
				<span class="group-hover:text-primary font-medium">{next.title}</span>
			</a>
		{/if}
	</nav>
{/if}
