<script lang="ts">
	import { STORE_CATEGORIES } from '#lib/tool/store-catalog';

	let searchQuery = $state('');

	function blurActive() {
		const el = document.activeElement;
		if (el instanceof HTMLElement) el.blur();
	}
</script>

<header class="sticky top-0 z-40 border-b border-ink-border/60 bg-base-100">
	<div class="navbar mx-auto max-w-6xl px-2 sm:px-4">
		<div class="navbar-start gap-1">
			<div class="dropdown lg:hidden">
				<div class="tooltip tooltip-bottom tooltip-primary" data-tip="Open menu">
					<div
						tabindex="0"
						role="button"
						class="btn btn-ghost btn-square btn-primary cursor-pointer"
						aria-label="Open menu"
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
							<path d="M4 5h16" />
							<path d="M4 12h16" />
							<path d="M4 19h16" />
						</svg>
					</div>
				</div>
				<ul
					tabindex="-1"
					class="menu dropdown-content menu-sm z-50 mt-3 w-56 rounded-box border border-ink-border bg-base-100 p-2 shadow"
				>
					{#each STORE_CATEGORIES as cat (cat.id)}
						<li>
							<a href={`#row-${cat.id}`} class="cursor-pointer" onclick={blurActive}>
								{cat.label}
							</a>
						</li>
					{/each}
					<li>
						<a href="#catalog" class="cursor-pointer font-medium" onclick={blurActive}>
							Browse apps
						</a>
					</li>
				</ul>
			</div>
			<a
				href="/"
				class="btn btn-ghost cursor-pointer px-2 font-display text-lg font-semibold tracking-tight sm:text-xl"
			>
				Menzies
			</a>
		</div>

		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal gap-0.5 px-1" aria-label="Store categories">
				{#each STORE_CATEGORIES as cat (cat.id)}
					<li>
						<a
							href={`#row-${cat.id}`}
							class="cursor-pointer font-normal text-ink-muted hover:text-base-content"
						>
							{cat.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="navbar-end gap-2">
			<div class="dropdown dropdown-end lg:hidden">
				<div class="tooltip tooltip-bottom tooltip-primary" data-tip="Search">
					<div
						tabindex="0"
						role="button"
						class="btn btn-ghost btn-square btn-primary cursor-pointer"
						aria-label="Search"
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
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
					</div>
				</div>
				<div
					tabindex="-1"
					class="dropdown-content z-50 mt-3 w-64 rounded-box border border-ink-border bg-base-100 p-3 shadow"
				>
					<label class="input input-sm flex w-full items-center gap-2 border-ink-border">
						<svg
							class="size-4 shrink-0 text-ink-muted"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						<input
							type="search"
							class="grow cursor-text bg-transparent text-sm"
							placeholder="Search apps"
							bind:value={searchQuery}
							aria-label="Search apps"
						/>
					</label>
				</div>
			</div>

			<label
				class="input input-sm hidden w-full max-w-[14rem] items-center gap-2 border-ink-border lg:flex xl:max-w-[16rem]"
			>
				<svg
					class="size-4 shrink-0 text-ink-muted"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
				<input
					type="search"
					class="grow cursor-text bg-transparent text-sm"
					placeholder="Search apps"
					bind:value={searchQuery}
					aria-label="Search apps"
				/>
			</label>

			<a href="#catalog" class="btn btn-primary btn-sm hidden cursor-pointer xl:inline-flex">
				Browse
			</a>
		</div>
	</div>
</header>
