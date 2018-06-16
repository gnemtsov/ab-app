'use strict';

const VALIDATORS = require('forms/validators');

const regexps = [
	{
		regexp: /^TINYINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				dbValidators = [[value => value >= 0 && value <= 255]];
			} else {
				dbValidators = [[value => value >= -128 && value <= 127]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BOOL(?:EAN)?$/,
		f: regexpResult => {
			return {
				dbValidators: [], // No need for validators here. Type itself is a constraint.
				type: 'Boolean'
			};
		}
	},
	{
		regexp: /^SMALLINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				dbValidators = [[value => value >= 0 && value <= 65535]];
			} else {
				dbValidators = [[value => value >= -32768 && value <= 32767]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^MEDIUMINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				dbValidators = [[value => value >= 0 && value <= 16777215]];
			} else {
				dbValidators = [[value => value >= -8388608 && value <= 8388607]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^INT(?:EGER)?(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				dbValidators = [[value => value >= 0 && value <= 4294967295]];
			} else {
				dbValidators = [[value => value >= -2147483648 && value <= 2147483647]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BIGINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				// js numbers are floats, so there is a problem with comparing big numbers
				// TODO: reimplement these checks on numbers being represented as strings
				dbValidators = [[value => value >= 0 && value <= 18446744073709551615]];
			} else {
				dbValidators = [[value => value >= -9223372036854775808 && value <= 9223372036854775807]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^(?:DEC|DECIMAL|NUMERIC|FIXED|FLOAT|DOUBLE|DOUBLE PRECISION|REAL)(?:\([0-9]+(?:,[0-9]+)?\))? *(SIGNED|UNSIGNED)? *(?:ZEROFILL)?$/,
		f: regexpResult => {
			let dbValidators = [];
			if (regexpResult[1] === 'UNSIGNED') {
				dbValidators = [[value => value >= 0]];
			}		
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BIT(?:\(([1-9][0-9]?)\))?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 1;
			const dbValidators = [[(value, size) => value.length === 3 + size && /^b'(?:0|1)+'$/.test(value), size]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:NATIONAL +)?CHAR(?:\(([0-9]+)\))? *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 1;
			const dbValidators = [[(value, size) => value.length === size, size]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:NATIONAL +)?VARCHAR\(([0-9]+)\) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const size = parseInt(regexpResult[1]);
			const dbValidators = [[(value, size) => value.length <= size, size]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:BINARY|CHAR BYTE|VARBINARY)\(([0-9]+)\)$/,
		f: regexpResult => {
			const size = parseInt(regexpResult[1]);
			const dbValidators = [[(value, size) => value.length <= size, size]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TINYBLOB$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 255]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^BLOB(?:\(([0-9]+)\))?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 65535;
			const dbValidators = [[(value, size) => value.length <= size, size]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMBLOB$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 16777215]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMBLOB$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 16777215]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^LONGBLOB$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 4294967295]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TINYTEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 255]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 65535]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMTEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 16777215]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:LONGTEXT|JSON) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const dbValidators = [[value => value.length <= 4294967295]];
			return {
				dbValidators: dbValidators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^ENUM\(((?:'[^']+', *)*'[^']+')\) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const allowedValues = [];
			let stringToParse = regexpResult[1];
			let x;
			while (x = /(?:'([^']+)', *)(.*)/.exec(stringToParse)) {
				allowedValues.push(x[1]);
				stringToParse = x[2];
			};
			allowedValues.push(/'([^']+)'/.exec(stringToParse)[1]);
			return {
				dbValidators: [],
				type: 'String',
				allowedValues: allowedValues
			};
		}
	},
	{
		regexp: /^SET\(((?:'[^']+', *)*'[^']+')\) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const allowedValues = [];
			let stringToParse = regexpResult[1];
			let x;
			while (x = /(?:'([^']+)', *)(.*)/.exec(stringToParse)) {
				allowedValues.push(x[1]);
				stringToParse = x[2];
			};
			allowedValues.push(/'([^']+)'/.exec(stringToParse)[1]);
			return {
				dbValidators: [],
				type: 'String',
				allowedValues: allowedValues
			};
		}
	},
	{
		regexp: /^DATE$/,
		f: regexpResult => {
			return {
				dbValidators: [],
				type: 'Date'
			};
		}
	},
	{
		regexp: /^TIME *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				dbValidators: [],
				type: 'Time'
			};
		}
	},
	{
		regexp: /^DATETIME *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				dbValidators: [],
				type: 'Datetime'
			};
		}
	},
	{
		regexp: /^TIMESTAMP *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				dbValidators: [],
				type: 'Timestamp'
			};
		}
	},
	{
		regexp: /^YEAR(?:\(([0-9]+)\))$/,
		f: regexpResult => {
			let dbValidators;
			if (regexpResult[1] === '2') {
				dbValidators = [];
			}
			if (regexpResult[1] === '4') {
				dbValidators = [[value => value === 0 || value >= 1901 && value <= 2155]];
			}
			return {
				dbValidators: dbValidators,
				type: 'Number'
			};
		}
	}
];

module.exports = row => {
	const validators = [];
	const type = row.Type.toUpperCase();
	
	for (const regexp of regexps) {
		const regexpResult = regexp.regexp.exec(type);
		if (regexpResult) {
			return regexp.f(regexpResult);
		}
	}
	return {};
}
