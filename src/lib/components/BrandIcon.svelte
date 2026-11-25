<script lang="ts">
	import { washBrand } from '$lib/tool/wash-brands';

	type Props = {
		slug: string;
		class?: string;
		title?: string;
	};

	let { slug, class: className = 'size-12', title }: Props = $props();

	const brand = $derived(washBrand(slug));
	const ariaLabel = $derived(title ?? brand?.title ?? slug);
</script>

{#if brand}
	<svg
		class="{className} rounded-box shrink-0"
		role="img"
		aria-label={ariaLabel}
		viewBox="0 0 24 24"
		fill={`#${brand.hex}`}
	>
		<title>{ariaLabel}</title>
		<path d={brand.path} />
	</svg>
{:else}
	<span
		class="bg-base-300 rounded-box inline-block shrink-0 {className}"
		role="img"
		aria-label={ariaLabel}
		title={ariaLabel}
	></span>
{/if}
