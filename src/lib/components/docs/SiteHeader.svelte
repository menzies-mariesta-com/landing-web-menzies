<script lang="ts">
	import { onMount } from 'svelte';
	import BrandMark from './BrandMark.svelte';
	import AppearanceMenu from '$lib/components/home/AppearanceMenu.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';

	let {
		onSearch,
		onMenu,
		shell = false
	}: {
		onSearch?: () => void;
		onMenu?: () => void;
		/** When true, header sits in the main column beside the sidebar (docs shell). */
		shell?: boolean;
	} = $props();

	let isMac = $state(false);

	onMount(() => {
		isMac =
			/Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS X/i.test(navigator.userAgent);
	});
</script>

<header
	class="app-chrome-bar border-ink-border/80 bg-base-100/80 sticky top-0 z-30 border-b px-4 backdrop-blur-sm lg:px-6 {shell
		? ''
		: 'z-40'}"
>
	<div class="flex w-full min-w-0 items-center justify-between gap-3">
		<!-- Left: menu + brand -->
		<div class="flex min-w-0 flex-row items-center gap-2 sm:gap-3">
			{#if onMenu}
				<button
					type="button"
					class="btn btn-ghost btn-square ripple shrink-0 cursor-pointer lg:hidden"
					aria-label={m.docs_chrome_open_menu()}
					onclick={onMenu}
				>
					<WashIcon icon={washIcons.menu} class="text-base-content size-5" title={undefined} />
				</button>
			{/if}

			<a href="/" class="flex min-w-0 cursor-pointer flex-row items-center gap-2.5 sm:gap-3">
				<BrandMark size={shell ? 'md' : 'sm'} />
				<span
					class="font-display truncate font-semibold tracking-tight {shell
						? 'text-xl lg:text-2xl'
						: 'text-lg sm:text-xl'}"
				>
					{m.docs_chrome_title()}
				</span>
			</a>
		</div>

		<!-- Right: search + theme -->
		<div class="flex shrink-0 flex-row items-center gap-1 sm:gap-2">
			{#if onSearch}
				<button
					type="button"
					class="btn btn-ghost border-ink-border bg-base-100 ripple hidden h-10 min-h-10 w-64 cursor-pointer justify-start gap-2 border px-3 font-normal md:inline-flex lg:w-72 xl:w-80"
					aria-label={m.docs_chrome_search_label()}
					onclick={onSearch}
				>
					<WashIcon
						icon={washIcons.search}
						class="text-base-content/75 size-4 shrink-0"
						title={undefined}
					/>
					<span class="text-base-content/60 min-w-0 flex-1 truncate text-left text-sm"
						>{m.docs_chrome_search()}</span
					>
					<kbd class="kbd kbd-sm border-ink-border bg-base-200 shrink-0 text-[0.65rem]"
						>{isMac ? '⌘' : 'Ctrl'}K</kbd
					>
				</button>
				<div
					class="tooltip tooltip-secondary tooltip-bottom md:hidden"
					data-tip={m.docs_chrome_search_label()}
				>
					<button
						type="button"
						class="btn btn-ghost btn-square ripple cursor-pointer"
						aria-label={m.docs_chrome_search_label()}
						onclick={onSearch}
					>
						<WashIcon icon={washIcons.search} class="text-base-content size-5" title={undefined} />
					</button>
				</div>
			{/if}
			<AppearanceMenu size="sm" />
		</div>
	</div>
</header>
