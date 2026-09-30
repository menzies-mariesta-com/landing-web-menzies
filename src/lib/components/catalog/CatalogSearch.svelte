<script lang="ts">
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';

	type Props = {
		value?: string;
		placeholder: string;
		label: string;
		id?: string;
	};

	let {
		value = $bindable(''),
		placeholder,
		label,
		id = 'catalog-search'
	}: Props = $props();
</script>

<label class="input w-full max-w-xl cursor-text" for={id}>
	<span class="sr-only">{label}</span>
	<WashIcon icon={washIcons.search} class="size-4 shrink-0 opacity-50" />
	<input
		{id}
		type="search"
		class="grow cursor-text"
		{placeholder}
		bind:value
		autocomplete="off"
		spellcheck="false"
	/>
</label>
