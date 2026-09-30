import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	ORIGIN: {
		description:
			'Public site origin for absolute URLs. Production: `https://store.menzies.design`. Local: `http://localhost:4004`.',
		public: true
	}
});
