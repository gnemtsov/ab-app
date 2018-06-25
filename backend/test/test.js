const expect = require('chai').expect;
const regexps = require('../forms/dbs/mariadb');

describe('mariadb.js: regexp for integer types', () => {
	const regexp = regexps[0];
	it('INTEGER', () => {
		const input = 'INTEGER';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-2147483648]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [2147483647]
				}
			]
		});
	});
	it('INTEGER(5)', () => {
		const input = 'INTEGER(5)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-2147483648]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [2147483647]
				}
			]
		});
	});
	it('BIGINT(10)', () => {
		const input = 'BIGINT(10)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-9223372036854775808]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [9223372036854775807]
				}
			]
		});
	});
	it('INTEGER SIGNED', () => {
		const input = 'INTEGER SIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-2147483648]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [2147483647]
				}
			]
		});
	});
	it('INTEGER(5)  SIGNED', () => {
		const input = 'INTEGER(5)  SIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-2147483648]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [2147483647]
				}
			]
		});
	});
	it('BIGINT(10)SIGNED', () => {
		const input = 'BIGINT(10)SIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'numType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-9223372036854775808]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [9223372036854775807]
				}
			]
		});
	});
});

describe('mariadb.js: regexp for string types', () => {
	const regexp = regexps[1];
	
	it('VARCHAR(5)', () => {
		const input = 'VARCHAR(5)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [5]
				}
			]
		});
	});
	it('NATIONAL VARCHAR(25)', () => {
		const input = 'NATIONAL VARCHAR(25)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [25]
				}
			]
		});
	});	
	it('TEXT', () => {
		const input = 'TEXT';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [65535]
				}
			]
		});
	});
	it('TEXT(256) CHARACTER SET utf8', () => {
		const input = 'TEXT(256) CHARACTER SET utf8';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [256]
				}
			]
		});
	});
	it('TINYTEXT', () => {
		const input = 'TINYTEXT';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [255]
				}
			]
		});
	});
	it('MEDIUMTEXT', () => {
		const input = 'MEDIUMTEXT';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [16777215]
				}
			]
		});
	});
	it('LONGTEXT', () => {
		const input = 'LONGTEXT';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [
				{
					f: 'strMax',
					message: 'String must be shorter or equal to %0% characters',
					params: [4294967295]
				}
			]
		});
	});
});

describe('mariadb.js: regexp for float types', () => {
	const regexp = regexps[2];
	
	it('DECIMAL', () => {
		const input = 'DECIMAL';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-9999999999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [9999999999]
				}
			]
		});
	});
	it('DECIMAL(5)', () => {
		const input = 'DECIMAL(5)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-99999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [99999]
				}
			]
		});
	});
	it('DECIMAL(5) SIGNED', () => {
		const input = 'DECIMAL(5) SIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-99999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [99999]
				}
			]
		});
	});
	it('DECIMAL(5) UNSIGNED', () => {
		const input = 'DECIMAL(5) UNSIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [0]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [99999]
				}
			]
		});
	});
	it('DECIMAL(5) ZEROFILL UNSIGNED', () => {
		const input = 'DECIMAL(5) ZEROFILL UNSIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [0]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [99999]
				}
			]
		});
	});
	it('DECIMAL(5) UNSIGNED ZEROFILL', () => {
		const input = 'DECIMAL(5) UNSIGNED ZEROFILL';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [0]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [99999]
				}
			]
		});
	});
	it('DECIMAL(5,2)', () => {
		const input = 'DECIMAL(5,2)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [999]
				}
			]
		});
	});
	it('DOUBLE', () => {
		const input = 'DOUBLE';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				}
			]
		});
	});
	it('DOUBLE(5,2)', () => {
		const input = 'DOUBLE(5,2)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [999]
				}
			]
		});
	});
	it('DOUBLE(5,2) SIGNED', () => {
		const input = 'DOUBLE(5,2) SIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [-999]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [999]
				}
			]
		});
	});
	it('DOUBLE(5,2) UNSIGNED', () => {
		const input = 'DOUBLE(5,2) UNSIGNED';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Number',
			validators: [
				{
					f: 'floatType',
					message: 'Value must a number'
				},
				{
					f: 'numMin',
					message: 'Value must be greater than %0%',
					params: [0]
				},
				{
					f: 'numMax',
					message: 'Value must be smaller than %0%',
					params: [999]
				}
			]
		});
	});
});

describe('mariadb.js: regexp for date types', () => {
	const regexp = regexps[3];

	it('DATE', () => {
		const input = 'DATE';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Datetime',
			validators: [
				{
					f: 'strIsShortDate',
					message: 'Value must be a date'
				},
				{
					f: 'dateMin',
					message: 'Date must be bigger than %0%',
					params: ['1000-01-01 00:00:00.000000']
				},
				{
					f: 'dateMax',
					message: 'Date must be less than %0%',
					params: ['9999-12-31 23:59:59.999999']
				}
			]
		});
	});
	it('DATETIME', () => {
		const input = 'DATETIME';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Datetime',
			validators: [
				{
					f: 'strIsDate',
					message: 'Value must be a date'
				},
				{
					f: 'dateMin',
					message: 'Date must be bigger than %0%',
					params: ['1000-01-01 00:00:00.000000']
				},
				{
					f: 'dateMax',
					message: 'Date must be less than %0%',
					params: ['9999-12-31 23:59:59.999999']
				}
			]
		});
	});
	it('DATETIME(5)', () => {
		const input = 'DATETIME(5)';
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'Datetime',
			validators: [
				{
					f: 'strIsDate',
					message: 'Value must be a date'
				},
				{
					f: 'dateMin',
					message: 'Date must be bigger than %0%',
					params: ['1000-01-01 00:00:00.000000']
				},
				{
					f: 'dateMax',
					message: 'Date must be less than %0%',
					params: ['9999-12-31 23:59:59.999999']
				}
			]
		});
	});
});

describe('mariadb.js: regexp for enums', () => {
	const regexp = regexps[4];

	it(`ENUM('x1')`, () => {
		const input = `ENUM('x1')`;
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [],
			allowedValues: ['x1']
		});
	});
	it(`ENUM('x1','x2')`, () => {
		const input = `ENUM('x1','x2')`;
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [],
			allowedValues: ['x1', 'x2']
		});
	});
	it(`ENUM('x1', 'x2')`, () => {
		const input = `ENUM('x1', 'x2')`;
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [],
			allowedValues: ['x1', 'x2']
		});
	});
	it(`enum('male','female') COLLATE utf8mb4_unicode_ci`, () => {
		const input = `enum('male','female') COLLATE utf8mb4_unicode_ci`;
		
		let output = null;
		const result = regexp.regexp.exec(input);
		if (result) {
			output = regexp.f(result);
		}
		
		expect(output).to.deep.equal({
			type: 'String',
			validators: [],
			allowedValues: ['male', 'female']
		});
	});
});
