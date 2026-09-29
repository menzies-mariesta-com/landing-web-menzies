<script lang="ts">
	import logo from '$lib/asset/image/logo.svg';
	import AppearanceMenu from '$lib/components/home/AppearanceMenu.svelte';
	import LanguageMenu from '$lib/components/home/LanguageMenu.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';
	import { CONTACT_EMAIL } from '$lib/util/seo';

	function blurActive() {
		const el = document.activeElement;
		if (el instanceof HTMLElement) el.blur();
	}

	const navLinks = $derived([
		{ href: '/plans', label: m.nav_plans() },
		{ href: '/apps', label: m.nav_apps() },
		{ href: '/library', label: m.nav_library() }
	] as const);

	const contactHref = `mailto:${CONTACT_EMAIL}`;
</script>

<header class="sticky top-0 z-40 border-b border-ink-border/60 bg-base-100">
	<div class="navbar mx-auto max-w-6xl px-2 sm:px-4">
		<div class="navbar-start gap-1">
			<div class="dropdown lg:hidden">
				<div class="tooltip tooltip-bottom tooltip-primary" data-tip={m.nav_open_menu()}>
					<div
						tabindex="0"
						role="button"
						class="btn btn-ghost btn-square btn-primary cursor-pointer"
						aria-label={m.nav_open_menu()}
					>
						<WashIcon icon={washIcons.menu} class="size-5" />
					</div>
				</div>
				<ul
					tabindex="-1"
					class="menu dropdown-content menu-sm z-50 mt-3 w-56 rounded-box border border-ink-border bg-base-100 p-2 shadow"
				>
					{#each navLinks as link (link.href)}
						<li>
							<a
								href={link.href}
								class="cursor-pointer"
								data-sveltekit-preload-data="hover"
								onclick={blurActive}
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
			<a
				href="/"
				class="btn btn-ghost cursor-pointer gap-2 px-2 font-display text-lg font-semibold tracking-tight sm:text-xl"
			>
				<img
					src={logo}
					alt={m.brand_menzies()}
					width="32"
					height="32"
					class="size-7 shrink-0 sm:size-8"
				/>
				<span>{m.brand_menzies()}</span>
			</a>
		</div>

		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal gap-0.5 px-1" aria-label="Primary">
				{#each navLinks as link (link.href)}
					<li>
						<a
							href={link.href}
							class="cursor-pointer font-normal text-ink-muted hover:text-base-content"
							data-sveltekit-preload-data="hover"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="navbar-end gap-1 sm:gap-2">
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
		</div>
	</div>
</header>
