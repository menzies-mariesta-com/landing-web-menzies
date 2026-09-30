<script lang="ts">
	import AppsCatalog from '$lib/components/home/AppsCatalog.svelte';
	import SectionViewMore from '$lib/components/home/SectionViewMore.svelte';
	import { MENZIES_APPS } from '$lib/tool/store-catalog';
	import { m } from '$lib/paraglide/messages';
</script>

<section id="apps" class="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="apps-title">
	<div class="mx-auto max-w-6xl">
		<SectionViewMore id="apps-title" title={m.apps_title()} href="/apps" />
		<AppsCatalog apps={MENZIES_APPS} />
	</div>
</section>
