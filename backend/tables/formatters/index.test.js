const Formatters = require('./index');

describe('tables formatters', () => {
	it('backendTestFormatter', () => {
		expect(Formatters.backendTestFormatter({}, {d_id: 4})).toBe('<b>8</b>');
		expect(Formatters.backendTestFormatter({}, {d_id: 17})).toBe('<b>34</b>');
	});
});
