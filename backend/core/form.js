'use strict';

const fs = require("fs");
const DB = require('core/db');

// tables - {"table_name_1": "row_id_1", "table_name_2": "row_id_2", ...}
// returns promise: Ok - frontendConfig, Error - HTTP response
exports.getAsObject = (formName, tables) => {
	// Loading full config from file
	const fullConfig = require(`forms/configs/${formName}.json`);

	// If no "tables" object was given, no DB call will happen
	let dataPromise = Promise.resolve(null);
	// Otherwise load data from DB
	if (tables !== undefined) {
		// data - {"table_name_1": row_1, "table_name_2": row_2, ...}
		// "data" object if filled by promises added to DBPromises array
		let data = {};
		let DBPromises = [];
		// For every "tableName" in "tables" object
		// make a DB query, add result to "data" object
		for (let tableName in tables) {
			if ( !tables.hasOwnProperty(tableName) ) {
				continue;
			}
			
			let promise = new Promise( (resolve, reject) => {
				fs.readFile(`forms/sql/${tableName}.sql`, 'utf8', (error, sql) => {
					if (error) {
						return reject(HTTP.response(500));
					}
					DB.execute(sql, [ tables[tableName] ], (error, result) => {
						if (error) {
							return reject(HTTP.response(500));
						}
						
						data[tableName] = result[0];
						resolve(null);
					});
				});
			});
			
			DBPromises.push(promise);
		}
		
		// When all promises from "DBPromises" are done,
		// "data" object is ready
		dataPromise = Promise.all(DBPromises).then( () => data );
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
