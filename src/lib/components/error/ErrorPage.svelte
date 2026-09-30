<script lang="ts">
	import MenziesLogoFlap from '$lib/components/home/MenziesLogoFlap.svelte';
	import StoreFooter from '$lib/components/home/StoreFooter.svelte';
	import StoreNav from '$lib/components/home/StoreNav.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { resolveErrorKind, type ErrorKind } from '$lib/tool/error-page';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';

	type Props = {
		status: number;
		/** Optional detail from `$page.error.message` (shown when distinct from the blurb). */
		detail?: string | null;
	};

	let { status, detail = null }: Props = $props();

	const kind = $derived(resolveErrorKind(status));

	const copy = $derived.by(() => {
		const map: Record<ErrorKind, { title: string; blurb: string }> = {
			401: { title: m.error_401_title(), blurb: m.error_401_blurb() },
			403: { title: m.error_403_title(), blurb: m.error_403_blurb() },
			404: { title: m.error_404_title(), blurb: m.error_404_blurb() },
			500: { title: m.error_500_title(), blurb: m.error_500_blurb() },
			502: { title: m.error_502_title(), blurb: m.error_502_blurb() },
			503: { title: m.error_503_title(), blurb: m.error_503_blurb() },
			fallback: { title: m.error_fallback_title(), blurb: m.error_fallback_blurb() }
		};
		return map[kind];
	});

	const showDetail = $derived.by(() => {
		const trimmed = detail?.trim();
		if (!trimmed) return false;
		const generic = new Set([
			'Not Found',
			'Not found',
			'Internal Error',
			'Forbidden',
			'Unauthorized',
			'Bad Gateway',
			'Service Unavailable'
		]);
		if (generic.has(trimmed)) return false;
		if (trimmed === copy.blurb || trimmed === copy.title) return false;
		return true;
	});

	function goBack() {
		if (typeof history !== 'undefined' && history.length > 1) {
			history.back();
			return;
		}
		window.location.href = '/';
	}
</script>

<div class="store-error flex min-h-dvh flex-col">
	<StoreNav />
	<main class="flex flex-1 items-center px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
		<div
			class="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 lg:gap-16"
		>
			<div class="max-w-xl md:max-w-2xl">
				<p class="font-mono text-sm font-medium tracking-wide text-primary">
					{m.error_status({ status: String(status) })}
				</p>
				<h1
					class="font-display mt-2 text-4xl font-semibold tracking-tight text-primary sm:text-5xl"
				>
					{copy.title}
				</h1>
				<p class="mt-3 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
					{copy.blurb}
				</p>
				{#if showDetail}
					<p class="mt-2 max-w-xl font-mono text-sm text-ink-muted/80">{detail}</p>
				{/if}
				<div class="mt-8 flex flex-wrap items-center gap-3">
					<a href="/" class="btn btn-primary cursor-pointer gap-2">
						<WashIcon icon={washIcons.house} class="size-4" />
						{m.error_cta_home()}
					</a>
					<button type="button" class="btn btn-ghost cursor-pointer gap-2" onclick={goBack}>
						<WashIcon icon={washIcons.arrowLeft} class="size-4" />
						{m.error_cta_back()}
					</button>
				</div>
			</div>

			<div class="flex justify-center md:justify-end">
				{#key `${kind}-${status}`}
					<MenziesLogoFlap />
				{/key}
			</div>
		</div>
	</main>
	<StoreFooter />
</div>
