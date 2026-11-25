<script lang="ts">
	import type { DocNavGroup, DocNavNode, DocTree } from '$lib/tool/docs/types';
	import type { WashIconNode } from '$lib/tool/wash-icon-node';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';

	let {
		groups,
		currentSlug
	}: {
		groups: DocNavGroup[];
		currentSlug: string;
	} = $props();

	const treeIcons: Record<DocTree, WashIconNode> = {
		'getting-started': washIcons.bookOpen,
		medora: washIcons.stethoscope,
		nextup: washIcons.ticket
	};

	/** Which folders are open, keyed by node id. Defaults to open. */
	let openById = $state<Record<string, boolean>>({});

	function isOpen(id: string) {
		return openById[id] ?? true;
	}

	function hasActive(node: DocNavNode): boolean {
		if (node.href?.endsWith(`/${currentSlug}`) || node.id === currentSlug) return true;
		return node.children.some(hasActive);
	}
</script>

{#snippet nodeItem(node: DocNavNode, depth: number)}
	{#if node.children.length > 0}
		<li>
			<details
				open={isOpen(node.id)}
				ontoggle={(e) => {
					openById = { ...openById, [node.id]: e.currentTarget.open };
				}}
			>
				<summary
					class="cursor-pointer py-1.5 text-sm {hasActive(node) ? 'text-primary font-medium' : ''}"
				>
					<span class="truncate">{node.title}</span>
				</summary>
				<ul class="border-ink-border/60 ms-2 mt-0.5 space-y-0.5 border-s py-0.5 ps-2">
					{#each node.children as child (child.id)}
						{@render nodeItem(child, depth + 1)}
					{/each}
				</ul>
			</details>
		</li>
	{:else if node.href}
		{@const active = node.href.endsWith(`/${currentSlug}`)}
		<li>
			<a
				href={node.href}
				class="ripple cursor-pointer py-1.5 text-sm {active ? 'menu-wash-active' : ''}"
				aria-current={active ? 'page' : undefined}
			>
				<span class="truncate">{node.title}</span>
			</a>
		</li>
	{/if}
{/snippet}

{#each groups as group (group.id)}
	{@const GroupIcon = treeIcons[group.id]}
	<li>
		<details
			open={isOpen(group.id)}
			ontoggle={(e) => {
				openById = { ...openById, [group.id]: e.currentTarget.open };
			}}
		>
			<summary
				class="cursor-pointer font-medium {group.nodes.some(hasActive) ? 'text-primary' : ''}"
			>
				<WashIcon icon={GroupIcon} class="size-4 shrink-0" title={undefined} />
				<span class="flex-1 truncate">{group.label}</span>
			</summary>
			<ul class="border-ink-border/60 ms-3 mt-0.5 space-y-0.5 border-s py-1 ps-3 pe-1">
				{#each group.nodes as node (node.id)}
					{@render nodeItem(node, 1)}
				{/each}
			</ul>
		</details>
	</li>
{/each}
