'use strict';

module.exports = [
    {
        regexp: /^(TINYINT|BOOLEAN|BOOL|SMALLINT|MEDIUMINT|INTEGER|INT|BIGINT)[0-9()\s]*(SIGNED|UNSIGNED|ZEROFILL)?$/i,
        f: result => {
            let [, type, attr = ''] = result;
            type = type.toUpperCase();
            attr = attr.toUpperCase();

            //type validator
            const numType = {
                name: 'numType',
                message: 'Value must a number'
            };

            //min validator         
            let numMin = {
                name: 'numMin',
                message: 'Value must be greater than %0%'
            };
            switch (attr) {
                case 'UNSIGNED':
                case 'ZEROFILL': numMin.params = [0]; break;
                default:
                    switch (type) {
                        case 'TINYINT': numMin.params = [-128]; break;
                        case 'BOOLEAN':
                        case 'BOOL': numMin.params = [0]; break;
                        case 'SMALLINT': numMin.params = [-32768]; break;
                        case 'MEDIUMINT': numMin.params = [-8388608]; break;
                        case 'INTEGER':
                        case 'INT': numMin.params = [-2147483648]; break;
                        case 'BIGINT': numMin.params = [-9223372036854775808]; break;
                    }
            }

            //max validator         
            let numMax = {
                name: 'numMax',
                message: 'Value must be smaller than %0%'
            };
            switch (type) {
                case 'TINYINT': numMax.params = [127]; break;
                case 'BOOLEAN':
                case 'BOOL': numMax.params = [1]; break;
                case 'SMALLINT': numMax.params = [32767]; break;
                case 'MEDIUMINT': numMax.params = [8388607]; break;
                case 'INTEGER':
                case 'INT': numMax.params = [2147483647]; break;
                case 'BIGINT': numMax.params = [9223372036854775807]; break;
            }
            switch (attr) {
                case 'UNSIGNED':
                case 'ZEROFILL':
                    numMax.params =
                        type === 'BOOL' || type === 'BOOLEAN' ?
                            numMax.params :
                            [numMax.params[0] * 2 + 1];
                    break;
            }

            return {
                validators: [numType, numMin, numMax],
                type: 'Number'
            };
        }
    },
    {
		regexp: /^(NATIONAL)?\s*(CHAR|VARCHAR|TEXT|TINYTEXT|MEDIUMTEXT|LONGTEXT|JSON)(\(([0-9]*)\))?/i,
        f: result => {
            let [, ,type, ,size] = result;
            type = type.toUpperCase();
            size = parseInt(size);
            
            // Max length validator
            let strMax = {
				name: 'strMax',
				message: 'String must be shorter or equal to %0% characters'
			};
            switch (type) {
				case 'CHAR':
				case 'VARCHAR':
					strMax.params = [ isNaN(size) ? 1 : size]; break;
				case 'TEXT':
					strMax.params = [ isNaN(size) ? 65535 : size]; break;
				case 'TINYTEXT':
					strMax.params = [ 255 ]; break;
				case 'MEDIUMTEXT':
					strMax.params = [ 16777215 ]; break;
				case 'LONGTEXT':
				case 'JSON':
					strMax.params = [ 4294967295 ]; break;
			}
            
            return {
                validators: [strMax],
                type: 'String'
            };
        }		
	},
    {
		regexp: /^(DEC|DECIMAL|NUMERIC|FIXED|FLOAT|DOUBLE|DOUBLE PRECISION|REAL)(\(([0-9]*)(,([0-9]*))?\))?\s*(SIGNED|UNSIGNED|ZEROFILL)?\s*(SIGNED|UNSIGNED|ZEROFILL)?$/i,
        f: result => {
            let [, type, , M0, , D0, attr1='', attr2=''] = result;
            type = type.toUpperCase();
            M0 = parseInt(M0);
            D0 = parseInt(D0);
            attr1 = attr1.toUpperCase();
            attr2 = attr2.toUpperCase();
            let M = M0;
            if (isNaN(M)) {
				M = 10;
			}
            let D = D0;
            if (isNaN(D)) {
				D = 0;
			}
			            
            //type validator
            const floatType = {
                name: 'floatType',
                message: 'Value must a number'
            };

            //min validator         
            let numMin = {
                name: 'numMin',
                message: 'Value must be greater than %0%'
            };
            const unsigned = attr1 == 'UNSIGNED' || attr2 == 'UNSIGNED';
			switch (type) {
				case 'DECIMAL':
				case 'DEC':
				case 'NUMERIC':
				case 'FIXED':
					numMin.params = [ unsigned ? 0 : -(Math.pow(10, M-D) - 1)]; break;
				default:
					if (unsigned) {
						numMin.params = [0];
					} else {
						// [(M0, D0)] - both or none
						if (isNaN(M0)) {
							numMin = undefined;
						} else {
							numMin.params = [ -(Math.pow(10, M-D) - 1)]; break;
						}
					}
			}

            //max validator         
            let numMax = {
                name: 'numMax',
                message: 'Value must be smaller than %0%'
            };
			switch (type) {
				case 'DECIMAL':
				case 'DEC':
				case 'NUMERIC':
				case 'FIXED':
					numMax.params = [ Math.pow(10, M-D) - 1]; break;
				default:
					// [(M0, D0)] - both or none
					if (isNaN(M0)) {
						numMax = undefined;
					} else {
						numMax.params = [ Math.pow(10, M-D) - 1]; break;
					}
			}			

			let validators = [floatType];
			if (numMin) {
				validators.push(numMin);
			}
			if (numMax) {
				validators.push(numMax);
			}
			
            return {
                validators: validators,
                type: 'Number'
            };
        }		
	},
	{
		regexp: /^(DATE)[0-9()\s]*$/i,
		f: result => {
			let [, type] = result;
            type = type.toUpperCase();
			
			const strIsDate = {
                name: 'strIsDate',
				message: 'Value must be a date'
			}
			
			const dateMin = {
				name: 'dateMin',
				message: 'Date must be bigger than %0%',
				params: ['1000-01-01']
			}
			
			const dateMax = {
				name: 'dateMax',
				message: 'Date must be less than %0%',
				params: ['9999-12-31']
			}
			
			return {
				validators: [strIsDate, dateMin, dateMax],
				type: 'Date'
			};
		}
	},
	{
		regexp: /^ENUM\(((?:'[^']+', *)*'[^']+')\)/i,
		f: result => {
			const allowedValues = [];
			let stringToParse = result[1];
			let x;
			while (x = /(?:'([^']+)', *)(.*)/.exec(stringToParse)) {
				allowedValues.push(x[1]);
				stringToParse = x[2];
			};
			allowedValues.push(/'([^']+)'/.exec(stringToParse)[1]);
			return {
				validators: [],
				type: 'String',
				allowedValues: allowedValues
			};
		}
	}
]



/* module.exports = [
	{
		regexp: /^TINYINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				validators = [[value => value >= 0 && value <= 255]];
			} else {
				validators = [[value => value >= -128 && value <= 127]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BOOL(?:EAN)?$/,
		f: regexpResult => {
			return {
				validators: [], // No need for validators here. Type itself is a constraint.
				type: 'Boolean'
			};
		}
	},
	{
		regexp: /^SMALLINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				validators = [[value => value >= 0 && value <= 65535]];
			} else {
				validators = [[value => value >= -32768 && value <= 32767]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^MEDIUMINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				validators = [[value => value >= 0 && value <= 16777215]];
			} else {
				validators = [[value => value >= -8388608 && value <= 8388607]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^INT(?:EGER)?(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				validators = [[value => value >= 0 && value <= 4294967295]];
			} else {
				validators = [[value => value >= -2147483648 && value <= 2147483647]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BIGINT(?:\([0-9]+\))? *(SIGNED|UNSIGNED|ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] && regexpResult[1] !== 'SIGNED') {
				// js numbers are floats, so there is a problem with comparing big numbers
				// TODO: reimplement these checks on numbers being represented as strings
				validators = [[value => value >= 0 && value <= 18446744073709551615]];
			} else {
				validators = [[value => value >= -9223372036854775808 && value <= 9223372036854775807]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^(?:DEC|DECIMAL|NUMERIC|FIXED|FLOAT|DOUBLE|DOUBLE PRECISION|REAL)(?:\([0-9]+(?:,[0-9]+)?\))? *(SIGNED|UNSIGNED)? *(?:ZEROFILL)?$/,
		f: regexpResult => {
			let validators = [] = [];
			if (regexpResult[1] === 'UNSIGNED') {
				validators = [[value => value >= 0]];
			}		
			return {
				validators: validators,
				type: 'Number'
			};
		}
	},
	{
		regexp: /^BIT(?:\(([1-9][0-9]?)\))?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 1;
			const validators = [[(value, size) => value.length === 3 + size && /^b'(?:0|1)+'$/.test(value), size]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:NATIONAL +)?CHAR(?:\(([0-9]+)\))? *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 1;
			const validators = [[(value, size) => value.length === size, size]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:NATIONAL +)?VARCHAR\(([0-9]+)\) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const size = parseInt(regexpResult[1]);
			const validators = [[(value, size) => value.length <= size, size]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:BINARY|CHAR BYTE|VARBINARY)\(([0-9]+)\)$/,
		f: regexpResult => {
			const size = parseInt(regexpResult[1]);
			const validators = [[(value, size) => value.length <= size, size]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TINYBLOB$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 255]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^BLOB(?:\(([0-9]+)\))?$/,
		f: regexpResult => {
			const size = regexpResult[1] ? parseInt(regexpResult[1]) : 65535;
			const validators = [[(value, size) => value.length <= size, size]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMBLOB$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 16777215]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMBLOB$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 16777215]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^LONGBLOB$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 4294967295]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TINYTEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 255]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^TEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 65535]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^MEDIUMTEXT *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 16777215]];
			return {
				validators: validators,
				type: 'String'
			};
		}
	},
	{
		regexp: /^(?:LONGTEXT|JSON) *(?:CHARACTER SET .+ +)?(?:COLLATE .+)?$/,
		f: regexpResult => {
			const validators = [[value => value.length <= 4294967295]];
			return {
				validators: validators,
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
				validators: [],
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
				validators: [],
				type: 'String',
				allowedValues: allowedValues
			};
		}
	},
	{
		regexp: /^DATE$/,
		f: regexpResult => {
			return {
				validators: [],
				type: 'Date'
			};
		}
	},
	{
		regexp: /^TIME *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				validators: [],
				type: 'Time'
			};
		}
	},
	{
		regexp: /^DATETIME *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				validators: [],
				type: 'Datetime'
			};
		}
	},
	{
		regexp: /^TIMESTAMP *\([0-9]+\)$/,
		f: regexpResult => {
			return {
				validators: [],
				type: 'Timestamp'
			};
		}
	},
	{
		regexp: /^YEAR(?:\(([0-9]+)\))$/,
		f: regexpResult => {
			let validators = [];
			if (regexpResult[1] === '2') {
				validators = [];
			}
			if (regexpResult[1] === '4') {
				validators = [[value => value === 0 || value >= 1901 && value <= 2155]];
			}
			return {
				validators: validators,
				type: 'Number'
			};
		}
	}
];
 */
