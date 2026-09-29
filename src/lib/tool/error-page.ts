/** HTTP statuses with dedicated copy on the shared error UI. */
export const KNOWN_ERROR_STATUSES = [401, 403, 404, 500, 502, 503] as const;

export type KnownErrorStatus = (typeof KNOWN_ERROR_STATUSES)[number];
export type ErrorKind = KnownErrorStatus | 'fallback';

export function resolveErrorKind(status: number): ErrorKind {
	if ((KNOWN_ERROR_STATUSES as readonly number[]).includes(status)) {
		return status as KnownErrorStatus;
	}
	return 'fallback';
}
