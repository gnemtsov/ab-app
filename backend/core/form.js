'use strict';

const fs = require("fs");
const DB = require('core/db');
const VALIDATORS = require('forms/validators');
const DB_VALIDATORS = require('forms/validators/mariadb');

const invalidField = (name, message) => {
    return {
        field: {
            name,
            message
        }
    }
};
exports.invalidField = invalidField;

exports.getAsObject = (formName, params = []) => {
    //fetch data from DB
    const sqlFile = `forms/sql/${formName}.sql`; //sql
    let dbFetchPromise = Promise.resolve([[]]);
    if (fs.existsSync(sqlFile)) {
        const sql = fs.readFileSync(`forms/sql/${formName}.sql`, 'utf8');
        dbFetchPromise = DB.then(conn => conn.execute(sql, params));
    }

    let fields = require(`forms/${formName}.json`); //fields
    return exports.addDBValidators(fields)
		.then( () => {
			//prepare validators for frontend
			fields = fields.map(field => {
				if (field.validators !== undefined) {
					field.validators = Object.keys(field.validators).map(name => {
						return {
							f: VALIDATORS[name].toString(),
							message: field.validators[name][0],
							params: field.validators[name].slice(1)
						}
					})
				}
				if (field.dbValidators) {
					const newValidators = field.dbValidators.map( v => {
						return {
							f: v[0].toString(),
							message: 'DB validator failed',
							params: v.slice(1)
						};
					});
					if (field.validators === undefined) {
						field.validators = newValidators;
					} else {
						field.validators.push(...newValidators);
					}
					delete field.dbValidators;
				}
				return field;
			});

			//fill the fields with data
			return dbFetchPromise.then(([rows]) => {
				if(rows.length === 1) {
					const row = rows[0];
					return fields.map(field => {
						if (row[field.name] !== undefined) {
							field.value = row[field.name];
						}
						return field;
					});
				}
				return fields;
			});
		});
};

// returns Promise (true|invalidField)
exports.isValid = (formName, data) => {
    const fields = require(`forms/${formName}.json`);
    return exports.addDBValidators(fields)
		.then( () => {
			for (const field of fields) {
				const {
					name,
					required,
					type,
					allowedValues,
					validators,
					dbValidators
				} = field;

				const value = data[name];

				if (value === undefined || value === '') {
					if (required) {
						return invalidField(name, 'Value is required');
					} else {
						continue;
					}
				}

				let wrongType = false;
				switch (type) {
					case 'Hidden':
						wrongType = typeof value !== 'string' && !(/^[1-9]{1}[0-9.]*$/.test(value));
						break;
					case 'String':
					case 'Text':
						wrongType = typeof value !== 'string';
						break;
					case 'Date':
						wrongType = !(/^\d{4}-\d{2}-\d{2}$/.test(value));
						break;
					case 'Time':
						wrongType = !(/^-?\d{1,3}:\d{2}:\d{2}.\d{1,6}$/.test(value));
						break;
					case 'Datetime':
						wrongType = !(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{1,6}$/.test(value));
						break;
					case 'Timestamp':
						wrongType = !(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value));
						break;
					case 'Number':
						wrongType = !(/^[1-9]{1}[0-9.]*$/.test(value));
						break;
					case 'Boolean':
						wrongType = typeof value !== 'boolean';
						break;
					default:
						wrongType = true;
				}
				if (wrongType) {
					return invalidField(name, 'Wrong type');
				}

				if (allowedValues !== undefined && !allowedValues.includes(value)) {
					return invalidField(name, 'Wrong value');
				}

				if (typeof validators === 'object') {
					for (const name of Object.keys(validators)) {
						const [message, ...params] = validators[name];
						if (!VALIDATORS[name](value, ...params)) {
							return invalidField(name, message);
						}
					}
				}
				
				if (dbValidators) {
					for (const v of dbValidators) {
						if ( !v[0](value, ...v.slice(1)) ) {
							return invelidField(name, 'DB validator failed');
						}
					}
				}
			}

			return true;
		});
};

// Modifies "configFields"
// Returns a Promise
exports.addDBValidators = configFields => {
	// Object containing promises loading types of DB table fields
	const tables = {};
	// Array of promises waiting for validators to be added for each field
	const addDBTypeValidatorsPromises = []; 
	for (const configField of configFields) {
		const tableName = configField.table;
		const columnName = configField.name;
		if (tableName && columnName) {
			if ( !tables[ tableName ] ) { 
				tables[ tableName ] = DB.then( conn => conn.execute(`SHOW COLUMNS FROM ${tableName}`) )
					.then( data => {
						const tableFieldInfos = {};
						for (const row of data[0]) {
							tableFieldInfos[row.Field] = row;
						}
						return tableFieldInfos;
					});
			}
			addDBTypeValidatorsPromises.push( tables[ tableName ].then( tableFieldInfos => {
				if (!configField.dbValidators) {
					configField.dbValidators = [];
				}
				
				const {dbValidators, type, allowedValues} = DB_VALIDATORS( tableFieldInfos[columnName] );
				configField.dbValidators.push(...dbValidators);
				if (!configField.type) {
					configField.type = type;
				}
				if (tableFieldInfos[columnName].Null === 'NO') {
					configField.required = true;
				}
				if (allowedValues && !configField.allowedValues) {
					configField.allowedValues = allowedValues;
				}
			}));
		}
	}
	return Promise.all(addDBTypeValidatorsPromises);
}
