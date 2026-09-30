<script lang="ts">
	import type { WashBrand } from '$lib/tool/wash-brands';

	type Props = {
		brand: WashBrand;
		class?: string;
		size?: number | string;
		/** When set, exposes the brand title for assistive tech. */
		title?: string;
	};

	let { brand, class: className = 'size-4', size, title }: Props = $props();

	const label = $derived(title ?? brand.title);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill={`#${brand.hex}`}
	class={className}
	role={title ? 'img' : undefined}
	aria-hidden={title ? undefined : 'true'}
	aria-label={title ? label : undefined}
>
	{#if title}
		<title>{label}</title>
	{/if}
	<path d={brand.path} />
</svg>
