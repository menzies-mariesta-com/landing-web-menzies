<script lang="ts">
	import WashBrandIcon from '$lib/tool/WashBrandIcon.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washBrands } from '$lib/tool/wash-brands';
	import { washIcons } from '$lib/tool/wash-icons';
	import { type MenziesApp } from '$lib/tool/store-catalog';
	import {
		fetchAppReleaseViaProxy,
		type AppReleaseManifest
	} from '$lib/tool/app-releases';
	import { m } from '$lib/paraglide/messages';

	type Props = {
		apps: MenziesApp[];
		emptyMessage?: string;
	};

	let { apps, emptyMessage }: Props = $props();

	let dialogEl = $state<HTMLDialogElement | null>(null);
	let selected = $state<MenziesApp | null>(null);
	let manifest = $state<AppReleaseManifest | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let clientCache = $state<Record<string, AppReleaseManifest | null>>({});

	async function loadManifest(app: MenziesApp, force = false) {
		const cached = clientCache[app.id];
		if (!force && cached) {
			manifest = cached;
			error = null;
			return;
		}

		loading = true;
		error = null;
		manifest = cached ?? null;

		try {
			// Same-origin proxy: browsers cannot fetch GitHub release assets (CORS).
			const next = await fetchAppReleaseViaProxy(app.id, { timeoutMs: 12000 });
			clientCache = { ...clientCache, [app.id]: next };
			manifest = next;
		} catch (err) {
			if (!manifest) {
				const detail = err instanceof Error ? err.message : '';
				error =
					detail && !/abort|fetch/i.test(detail)
						? `Could not load download links (${detail}). Try again in a moment.`
						: 'Could not load download links right now. Try again in a moment.';
			}
		} finally {
			loading = false;
		}
	}

	async function openApp(app: MenziesApp) {
		selected = app;
		manifest = clientCache[app.id] ?? null;
		error = null;
		dialogEl?.showModal();
		await loadManifest(app, true);
	}

	function closeDialog() {
		dialogEl?.close();
	}

	function onDialogClose() {
		selected = null;
		loading = false;
		error = null;
	}
</script>

{#if apps.length === 0}
	<p class="mt-8 text-sm text-ink-muted" role="status">
		{emptyMessage ?? m.catalog_search_empty()}
	</p>
{:else}
	<ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each apps as app (app.id)}
			<li>
				<button
					id={`app-${app.id}`}
					type="button"
					class="flex h-full w-full cursor-pointer flex-col gap-3 rounded-box border border-ink-border/70 p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
					onclick={() => openApp(app)}
				>
					<img
						src={app.iconSrc}
						alt={`${app.name} icon`}
						width="48"
						height="48"
						class="size-12 shrink-0 rounded-box"
						decoding="async"
						loading="lazy"
					/>
					<span class="min-w-0">
						<span class="block font-medium text-base-content">{app.name}</span>
						<span class="mt-0.5 block text-sm text-ink-muted">{app.kind}</span>
						{#if clientCache[app.id]?.version}
							<span class="mt-1 block text-xs text-ink-muted">
								v{clientCache[app.id]?.version}
							</span>
						{/if}
						<span class="mt-2 block text-sm leading-relaxed text-ink-muted">{app.tagline}</span>
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}

<dialog
	bind:this={dialogEl}
	class="modal modal-bottom sm:modal-middle"
	aria-labelledby="app-dialog-title"
	onclose={onDialogClose}
>
	{#if selected}
		<div class="modal-box max-h-[85vh] w-11/12 max-w-lg overflow-y-auto">
			<form method="dialog">
				<div class="tooltip tooltip-left tooltip-primary absolute right-2 top-2" data-tip="Close">
					<button
						type="submit"
						class="btn btn-ghost btn-square btn-sm btn-primary cursor-pointer"
						aria-label="Close"
					>
						<WashIcon icon={washIcons.x} class="size-4" />
					</button>
				</div>
			</form>

			<div class="flex items-start gap-3 pr-10">
				<img
					src={selected.iconSrc}
					alt=""
					width="56"
					height="56"
					class="size-14 shrink-0 rounded-box"
					decoding="async"
				/>
				<div class="min-w-0">
					<h3 id="app-dialog-title" class="card-title text-primary font-bold">
						{selected.name}
					</h3>
					<p class="mt-0.5 text-sm text-ink-muted">{selected.kind}</p>
					{#if manifest?.version}
						<p class="mt-1 text-sm text-ink-muted">Latest: v{manifest.version}</p>
					{/if}
				</div>
			</div>

			<p class="mt-4 text-sm leading-relaxed text-base-content">{selected.description}</p>

			{#if selected.githubUrl}
				<a
					href={selected.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost btn-sm mt-4 cursor-pointer gap-2"
				>
					<WashBrandIcon brand={washBrands.github} class="size-4" />
					View on GitHub
				</a>
			{/if}

			<div class="mt-6">
				<h4 class="text-sm font-semibold text-base-content">Downloads</h4>

				{#if loading && !manifest}
					<ul class="mt-3 space-y-2" aria-busy="true" aria-label="Loading downloads">
						{#each [1, 2, 3] as n (n)}
							<li class="skeleton h-12 w-full rounded-box"></li>
						{/each}
					</ul>
				{:else if error && !manifest}
					<p class="mt-3 text-sm text-error" role="alert">{error}</p>
					<button
						type="button"
						class="btn btn-primary btn-sm mt-3 cursor-pointer"
						class:loading={loading}
						class:btn-disabled={loading}
						class:cursor-pointer={!loading}
						class:cursor-not-allowed={loading}
						disabled={loading}
						aria-busy={loading}
						onclick={() => selected && loadManifest(selected, true)}
					>
						Retry
					</button>
				{:else if manifest && manifest.downloads.length === 0}
					<p class="mt-3 text-sm text-ink-muted">No installers listed in the latest release yet.</p>
				{:else if manifest}
					<ul class="mt-3 space-y-2">
						{#each manifest.downloads as file (file.id)}
							<li>
								<a
									href={file.url}
									class="btn btn-outline btn-block h-auto min-h-12 cursor-pointer justify-start gap-3 px-3 py-2 text-left"
									download
								>
									<WashIcon icon={washIcons.download} class="size-4 shrink-0" />
									<span class="min-w-0">
										<span class="block font-medium">{file.label}</span>
										<span class="block truncate text-xs font-normal text-ink-muted">
											{file.filename}
										</span>
									</span>
								</a>
							</li>
						{/each}
					</ul>
					{#if loading}
						<p class="mt-2 text-xs text-ink-muted" aria-live="polite">Refreshing release…</p>
					{/if}
				{/if}
			</div>

			<div class="modal-action">
				<form method="dialog">
					<button type="submit" class="btn cursor-pointer" onclick={closeDialog}>Close</button>
				</form>
			</div>
		</div>
	{/if}
	<form method="dialog" class="modal-backdrop">
		<button type="submit" class="cursor-pointer" aria-label="Close dialog">close</button>
	</form>
</dialog>
