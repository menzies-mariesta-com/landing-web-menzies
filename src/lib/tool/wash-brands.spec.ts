import { describe, expect, it } from 'vitest';
import { DBMS_DRIVER_EXTENSIONS } from '$lib/tool/dbms-driver-extensions';
import { washBrand, washBrands } from '$lib/tool/wash-brands';

describe('washBrands', () => {
	it('resolves every DBMS driver icon slug', () => {
		for (const driver of DBMS_DRIVER_EXTENSIONS) {
			expect(washBrand(driver.iconSlug), driver.iconSlug).toBeDefined();
		}
	});

	it('keeps slug keys aligned with entries', () => {
		for (const [key, brand] of Object.entries(washBrands)) {
			expect(brand.slug).toBe(key);
		}
	});

	it('returns undefined for inherited object keys', () => {
		expect(washBrand('constructor')).toBeUndefined();
		expect(washBrand('missing')).toBeUndefined();
	});
});
