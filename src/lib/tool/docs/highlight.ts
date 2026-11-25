import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({
			themes: ['github-light', 'github-dark'],
			langs: [
				'bash',
				'html',
				'css',
				'javascript',
				'typescript',
				'svelte',
				'json',
				'ini',
				'markdown',
				'tsx',
				'jsx'
			]
		});
	}
	return highlighterPromise;
}

export async function highlightCode(code: string, lang = 'text'): Promise<string> {
	// Mermaid renders as source in a plain block, matching Medora's docs renderer.
	if (lang === 'mermaid') {
		const escaped = code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
		return `<pre class="docs-mermaid-fallback my-4 overflow-x-auto rounded-box border border-base-300 bg-base-200/50 p-3 text-xs leading-relaxed" aria-label="Workflow diagram">${escaped}</pre>`;
	}
	const highlighter = await getHighlighter();
	const normalized = lang === 'sh' || lang === 'shell' || lang === 'zsh' ? 'bash' : lang;
	const loaded = highlighter.getLoadedLanguages();
	const language = loaded.includes(normalized as never) ? normalized : 'text';

	try {
		return highlighter.codeToHtml(code, {
			lang: language,
			themes: {
				light: 'github-light',
				dark: 'github-dark'
			},
			defaultColor: false
		});
	} catch {
		const escaped = code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
		return `<pre class="shiki"><code>${escaped}</code></pre>`;
	}
}
