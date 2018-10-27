const Utils = require('./utils');

describe('core/utils', () => {
	it('coalesce', () => {
		expect(Utils.coalesce()).toEqual(null);
		expect(Utils.coalesce([])).toEqual([]);
		expect(Utils.coalesce(null, 1, null, 2)).toEqual(1);
		expect(Utils.coalesce(null, undefined, 1, null, 2)).toEqual(1);
		expect(Utils.coalesce(null, undefined)).toEqual(null);
		expect(Utils.coalesce(null, 0, null)).toEqual(0);
		expect(Utils.coalesce(undefined, undefined)).toEqual(null);
	});
});
