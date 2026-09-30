/**
 * Snapshot of `globalThis.fetch` at module load.
 * SvelteKit DEV mode temporarily replaces `globalThis.fetch` during page SSR to
 * warn about eager fetches. Concurrent API handlers that still call the live
 * `globalThis.fetch` (e.g. GitHub latest.json) trip that warning spuriously.
 * Import this module from `hooks.server.ts` so it evaluates before requests.
 */
export const nativeFetch: typeof globalThis.fetch = globalThis.fetch.bind(globalThis);
