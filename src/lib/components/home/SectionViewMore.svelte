<script lang="ts">
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';
	import { m } from '$lib/paraglide/messages';

	type Props = {
		id: string;
		title: string;
		href: string;
	};

	let { id, title, href }: Props = $props();
</script>

<div class="flex items-center justify-between gap-4">
	<h2
		{id}
		class="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
	>
		{title}
	</h2>
	<a
		{href}
		class="btn btn-ghost btn-primary cursor-pointer gap-2"
		data-sveltekit-preload-data="hover"
	>
		{m.view_more()}
		<WashIcon icon={washIcons.arrowRight} class="size-5" />
	</a>
</div>
