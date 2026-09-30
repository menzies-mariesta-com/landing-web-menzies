<script lang="ts">
	import logo from '$lib/asset/image/logo.svg';
	import { m } from '$lib/paraglide/messages';
</script>

<footer class="border-t border-ink-border/60 px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
		<div class="sm:col-span-2 lg:col-span-1">
			<a href="/" class="inline-flex cursor-pointer items-center gap-2">
				<img
					src={logo}
					alt={m.brand_menzies()}
					width="28"
					height="28"
					class="size-7 shrink-0"
				/>
				<span class="font-display text-lg font-semibold tracking-tight">{m.brand_menzies()}</span>
			</a>
			<p class="mt-2 max-w-xs text-sm leading-relaxed text-ink-muted">
				{m.footer_blurb()}
			</p>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">{m.footer_explore()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<a href="/plans" class="cursor-pointer text-sm text-ink-muted hover:text-primary"
						>{m.nav_plans()}</a
					>
				</li>
				<li>
					<a href="/apps" class="cursor-pointer text-sm text-ink-muted hover:text-primary"
						>{m.nav_apps()}</a
					>
				</li>
				<li>
					<a href="/library" class="cursor-pointer text-sm text-ink-muted hover:text-primary"
						>{m.nav_library()}</a
					>
				</li>
				<li>
					<a href="/branding" class="cursor-pointer text-sm text-ink-muted hover:text-primary"
						>{m.nav_branding()}</a
					>
				</li>
			</ul>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">{m.nav_library()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<a
						href="/library#library-wash-ui"
						class="cursor-pointer text-sm text-ink-muted hover:text-primary">Wash UI</a
					>
				</li>
			</ul>
		</div>

		<div>
			<p class="text-sm font-medium text-base-content">{m.footer_legal()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<span class="text-sm text-ink-muted">{m.footer_privacy_soon()}</span>
				</li>
				<li>
					<span class="text-sm text-ink-muted">{m.footer_terms_soon()}</span>
				</li>
			</ul>
		</div>
	</div>

	<p class="mx-auto mt-10 max-w-6xl text-xs text-ink-muted">
		{m.footer_copy({ year: String(new Date().getFullYear()) })}
	</p>
</footer>
