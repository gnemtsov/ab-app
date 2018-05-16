'use strict';

const fs = require("fs");
const DB = require('core/db');

// returns promise: Ok - frontendConfig, Error - HTTP response
exports.getAsObject = (formName, id) => {
	// Loading full config from file
	const fullConfig = require(`forms/configs/${formName}.json`);

	// If no id was given, no DB call will happen
	let dataPromise = Promise.resolve(null);
	// Otherwise load data from DB
	if (id !== undefined) {
		const sql = fs.readFileSync(`forms/sql/${formName}.sql`, 'utf8');
		
		dataPromise = new Promise( (resolve, reject) => {
			DB.execute(sql, [id], (error, result) => {
				if (error) {
					reject(HTTP.response(500));
				} else {
					let data = {};
					data[formName] = result[0];
					
					resolve(data);
				}
			});
		});
	}

	return dataPromise
		.then( (data) => {
			console.log('data = ', data);
					
			let frontendConfig = {};
			for (let fieldName in fullConfig) {
				if ( !fullConfig.hasOwnProperty(fieldName) ) {
					continue;
				}
				
				// For each field taking only properties needed for client
				let frontendField = {};
				frontendConfig[fieldName] = frontendField;
				const field = fullConfig[fieldName];
				
				if ( field.hasOwnProperty('type') ) {
					frontendField.type = field.type;
				}

				if ( field.hasOwnProperty('nullable') ) {
					frontendField.nullable = field.nullable;
				}
				
				// Unlike fullConfig from *.json,
				// frontendConfig's validators don't have 'both' and 'backend' subobjects
				// frontendConfig's validators are fullConfig's validators.both
				if ( field.hasOwnProperty('validators') ) {
					const validators = field.validators;
					
					if ( validators.hasOwnProperty('both') ) {
						frontendField.validators = validators.both;
					}
				}
				
				// Setting frontendField.value if data is provided
				if (data) {
					console.log(field);
					if ( field.hasOwnProperty('db_table') ) {
						const db_table = field.db_table;
						
						if ( field.hasOwnProperty('db_column') ) {
							const db_column = field.db_column;
							
							if ( data.hasOwnProperty(db_table) && data[db_table].hasOwnProperty(db_column) ) {
								frontendField.value = data[db_table][db_column];
							}
						}
					}
				}
			}
			return frontendConfig;
		});
};
