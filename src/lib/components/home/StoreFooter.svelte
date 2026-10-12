<script lang="ts">
	import logo from '$lib/asset/image/logo.svg';
	import { m } from '$lib/paraglide/messages';
</script>

<footer class="border-ink-border/60 border-t px-4 py-12 sm:px-6 sm:py-16">
	<div class="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
		<div class="sm:col-span-2 lg:col-span-1">
			<a href="/" class="inline-flex cursor-pointer items-center gap-2">
				<img src={logo} alt={m.brand_menzies()} width="28" height="28" class="size-7 shrink-0" />
				<span class="font-display text-lg font-semibold tracking-tight">{m.brand_menzies()}</span>
			</a>
			<p class="text-ink-muted mt-2 max-w-xs text-sm leading-relaxed">
				{m.footer_blurb()}
			</p>
		</div>

		<div>
			<p class="text-base-content text-sm font-medium">{m.footer_explore()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<a href="/plans" class="text-ink-muted hover:text-primary cursor-pointer text-sm"
						>{m.nav_plans()}</a
					>
				</li>
				<li>
					<a href="/apps" class="text-ink-muted hover:text-primary cursor-pointer text-sm"
						>{m.nav_apps()}</a
					>
				</li>
				<li>
					<a href="/library" class="text-ink-muted hover:text-primary cursor-pointer text-sm"
						>{m.nav_library()}</a
					>
				</li>
				<li>
					<a href="/branding" class="text-ink-muted hover:text-primary cursor-pointer text-sm"
						>{m.nav_branding()}</a
					>
				</li>
				<li>
					<a href="/extensions" class="text-ink-muted hover:text-primary cursor-pointer text-sm"
						>{m.nav_extensions()}</a
					>
				</li>
			</ul>
		</div>

		<div>
			<p class="text-base-content text-sm font-medium">{m.nav_library()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<a
						href="/library#library-wash-ui"
						class="text-ink-muted hover:text-primary cursor-pointer text-sm">Wash UI</a
					>
				</li>
			</ul>
		</div>

		<div>
			<p class="text-base-content text-sm font-medium">{m.footer_legal()}</p>
			<ul class="mt-3 space-y-2">
				<li>
					<span class="text-ink-muted text-sm">{m.footer_privacy_soon()}</span>
				</li>
				<li>
					<span class="text-ink-muted text-sm">{m.footer_terms_soon()}</span>
				</li>
			</ul>
		</div>
	</div>

	<p class="text-ink-muted mx-auto mt-10 max-w-6xl text-xs">
		{m.footer_copy({ year: String(new Date().getFullYear()) })}
	</p>
</footer>
