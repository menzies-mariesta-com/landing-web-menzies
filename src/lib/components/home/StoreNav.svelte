<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { washRecipes } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
	import { closeDetailsOnOutside } from '$lib/attachments/close-details-on-outside';
	import logo from '$lib/asset/image/logo.svg';
	import AppearanceMenu from '$lib/components/home/AppearanceMenu.svelte';
	import LanguageMenu from '$lib/components/home/LanguageMenu.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';
	import { CONTACT_EMAIL } from '$lib/util/seo';

	let mobileOpen = $state(false);

	/** Route ids for `resolve`; `path` is the public URL for active matching. */
	const navLinks = $derived([
		{ route: '/(public)/plans' as const, path: '/plans', label: m.nav_plans() },
		{ route: '/(public)/apps' as const, path: '/apps', label: m.nav_apps() },
		{ route: '/(public)/library' as const, path: '/library', label: m.nav_library() }
	]);

	const contactHref = `mailto:${CONTACT_EMAIL}`;

	function isActive(path: string): boolean {
		const current = page.url.pathname;
		return current === path || current.startsWith(`${path}/`);
	}

	function closeMobile() {
		mobileOpen = false;
	}
</script>

<header
	class="sticky top-0 z-40 border-b border-ink-border/80 bg-base-100/80 backdrop-blur-sm"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:px-6">
		<div class="flex min-w-0 items-center gap-1 sm:gap-2">
			<div class="tooltip tooltip-bottom tooltip-primary lg:hidden" data-tip={m.nav_open_menu()}>
				<details class="dropdown" bind:open={mobileOpen} {@attach closeDetailsOnOutside()}>
					<summary
						class="btn btn-ghost btn-square btn-sm btn-primary cursor-pointer list-none [&::-webkit-details-marker]:hidden"
						aria-label={m.nav_open_menu()}
						aria-expanded={mobileOpen}
					>
						<WashIcon icon={washIcons.menu} class="size-5" />
					</summary>
					<ul
						class="{washRecipes.menu} menu-sm dropdown-content z-50 mt-3 w-52 max-h-[min(70vh,24rem)] max-w-[min(100vw-1rem,13rem)] overflow-x-hidden overflow-y-auto p-2 shadow-[var(--shadow-paper-md)]"
					>
						{#each navLinks as link (link.path)}
							<li>
								<a
									href={resolve(link.route)}
									class="cursor-pointer"
									class:active={isActive(link.path)}
									aria-current={isActive(link.path) ? 'page' : undefined}
									data-sveltekit-preload-data="hover"
									onclick={closeMobile}
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</details>
			</div>

			<a
				href={resolve('/')}
				class="font-display flex min-w-0 cursor-pointer items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl"
			>
				<img
					src={logo}
					alt=""
					width="32"
					height="32"
					class="size-7 shrink-0 sm:size-8"
					aria-hidden="true"
				/>
				<span class="truncate">{m.brand_menzies()}</span>
			</a>
		</div>

		<nav class="flex items-center gap-1 sm:gap-2" aria-label="Primary">
			{#each navLinks as link (link.path)}
				<a
					href={resolve(link.route)}
					class="btn btn-ghost btn-sm hidden cursor-pointer lg:inline-flex"
					class:btn-active={isActive(link.path)}
					aria-current={isActive(link.path) ? 'page' : undefined}
					data-sveltekit-preload-data="hover"
				>
					{link.label}
				</a>
			{/each}

			<div class="tooltip tooltip-bottom tooltip-primary" data-tip={m.common_contact()}>
				<a
					href={contactHref}
					class="btn btn-ghost btn-square btn-sm btn-primary cursor-pointer"
					aria-label={m.common_contact()}
				>
					<WashIcon icon={washIcons.mail} class="size-4" />
				</a>
			</div>
			<AppearanceMenu size="sm" />
			<LanguageMenu size="sm" />
		</nav>
	</div>
</header>
