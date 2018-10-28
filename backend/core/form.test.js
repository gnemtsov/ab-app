const Form = require('./form');

jest.mock('fs');

describe('core/form', () => {
	it('invalidField', () => {
		expect(Form.invalidField("a", "b")).toEqual({field: {name: "a", message: "b"}});
	});
});

