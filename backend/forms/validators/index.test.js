const Validators = require('./index');

describe('forms validators', () => {
	it('boolTrue', () => {
		expect(Validators.boolTrue(true)).toBe(true);
		expect(Validators.boolTrue(false)).toBe(false);
	});

	it('strMinMax', () => {
		expect(Validators.strMinMax("abcd", 2, 5)).toBe(true);
		expect(Validators.strMinMax("abcd", 2, 4)).toBe(true);
		expect(Validators.strMinMax("ab",   3, 5)).toBe(false);
		expect(Validators.strMinMax("abcd", 2, 3)).toBe(false);
	});
	
	it('strMax', () => {
		expect(Validators.strMax("abcd", 5)).toBe(true);
		expect(Validators.strMax("abcd", 4)).toBe(true);
		expect(Validators.strMax("abcd", 3)).toBe(false);
	});

	it('strEquals', () => {
		expect(Validators.strEquals("123", 123)).toBe(false);
		expect(Validators.strEquals("abc", "abc")).toBe(true);
	});

	it('strIsDate', () => {
		expect(Validators.strIsDate("2018-10-27")).toBe(true);
		expect(Validators.strIsDate("20181027")).toBe(false);
		expect(Validators.strIsDate("2018-27-10")).toBe(true);
		expect(Validators.strIsDate("9999-99-99")).toBe(true);
		expect(Validators.strIsDate("10-27-2018")).toBe(false);
		expect(Validators.strIsDate(null)).toBe(false);
		expect(Validators.strIsDate(undefined)).toBe(false);
	});

	it('strIsDateTime', () => {
		expect(Validators.strIsDatetime("abcdef")).toBe(false);
		expect(Validators.strIsDatetime("2018-10-27")).toBe(true);
		expect(Validators.strIsDatetime("20181027")).toBe(false);
		expect(Validators.strIsDatetime("2018-27-10")).toBe(false);
		expect(Validators.strIsDatetime("9999-99-99")).toBe(false);
		expect(Validators.strIsDatetime("10-27-2018")).toBe(true);	
		expect(Validators.strIsDatetime("2018/10/27")).toBe(true);
		expect(Validators.strIsDatetime("2018/27/10")).toBe(false);
		expect(Validators.strIsDatetime("01 Jan 1970 00:00:00 GMT")).toBe(true);
	});
	
	it('numType', () => {
		expect(Validators.numType(10)).toBe(true);
		expect(Validators.numType(-10)).toBe(true);
		expect(Validators.numType('10')).toBe(true);
		expect(Validators.numType('-10')).toBe(true);
		expect(Validators.numType('10-')).toBe(false);
		expect(Validators.numType('10.0')).toBe(false);
	});
	
	it('numMinMax', () => {
		expect(Validators.numMinMax(5, 0, 10)).toBe(true);
		expect(Validators.numMinMax(5, 5, 10)).toBe(true);
		expect(Validators.numMinMax(5, 0, 5)).toBe(true);
		expect(Validators.numMinMax(5, 6, 10)).toBe(false);
		expect(Validators.numMinMax(5, 0, 4)).toBe(false);
	});
	
	it('numMin', () => {
		expect(Validators.numMin(4, 6)).toBe(false);
		expect(Validators.numMin(6, 4)).toBe(true);
		expect(Validators.numMin(4, 4)).toBe(true);
	});
	
	it('numMax', () => {
		expect(Validators.numMax(4, 6)).toBe(true);
		expect(Validators.numMax(6, 4)).toBe(false);
		expect(Validators.numMax(4, 4)).toBe(true);
	});
	
	it('floatType', () => {
		expect(Validators.floatType(1.0)).toBe(true);
		expect(Validators.floatType(-1.0)).toBe(true);
		expect(Validators.floatType('1.0')).toBe(true);
		expect(Validators.floatType('-1.0')).toBe(true);
		expect(Validators.floatType(10)).toBe(true);
		expect(Validators.floatType(-10)).toBe(true);
		expect(Validators.floatType('10')).toBe(true);
		expect(Validators.floatType('-10')).toBe(true);	
		expect(Validators.floatType('1,0')).toBe(false);
		expect(Validators.floatType('-1,0')).toBe(false);	
	});	
	
	it('dateMin', () => {
		expect(Validators.dateMin("10-27-2018", "10-28-2018")).toBe(false);
		expect(Validators.dateMin("2018/10/27", "2018/10/28")).toBe(false);
		expect(Validators.dateMin("10-27-2018", "27-10-2018")).toBe(false);
		expect(Validators.dateMin("2018/10/27", "2018/10/27")).toBe(true);
		expect(Validators.dateMin("2018/10/29", "2018/10/28")).toBe(true);
		expect(Validators.dateMin("2018/10/29", "2018/10/27")).toBe(true);		
		expect(Validators.dateMin("01 Jan 1970 00:00:00 GMT", "01 Jan 1970 00:00:01 GMT")).toBe(false);	
	});	
	
	it('dateMax', () => {
		expect(Validators.dateMax("10-27-2018", "10-28-2018")).toBe(true);
		expect(Validators.dateMax("2018/10/27", "2018/10/28")).toBe(true);
		expect(Validators.dateMax("10-27-2018", "27-10-2018")).toBe(false);
		expect(Validators.dateMax("2018/10/27", "2018/10/27")).toBe(true);
		expect(Validators.dateMax("2018/10/29", "2018/10/28")).toBe(false);
		expect(Validators.dateMax("2018/10/29", "2018/10/27")).toBe(false);		
		expect(Validators.dateMax("01 Jan 1970 00:00:00 GMT", "01 Jan 1970 00:00:01 GMT")).toBe(true);	
	});
});
