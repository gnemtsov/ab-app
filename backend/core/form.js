'use strict';

exports.clientJSON = (formName, data) => {
	// Loading full config from file
	const fullConfig = require('forms/configs/' + formName + '.json');

	let clientConfig = {};
	for (let fieldName in fullConfig) {
		// For each field taking only properties needed for client
		let clientField = {};
		clientConfig[fieldName] = clientField;
		const field = fullConfig[fieldName];
		
		if ( field.hasOwnProperty('type') ) {
			clientField.type = field.type;
		}

		if ( field.hasOwnProperty('nullable') ) {
			clientField.nullable = field.nullable;
		}
		
		// Unlike fullConfig from *.json,
		// clientConfig's validators don't have 'both' and 'backend' subobjects
		// clientConfig's validators are fullConfig's validators.both
		if ( field.hasOwnProperty('validators') ) {
			const validators = field.validators;
			
			if ( validators.hasOwnProperty('both') ) {
				clientField.validators = validators.both;
			}
		}
		
		// Setting clientField.value if data is provided
		if (data) {
			if ( field.hasOwnProperty('db_table') ) {
				const db_table = field.db_table;
				
				if ( field.hasOwnProperty('db_column') ) {
					const db_column = field.db_column;
					
					if ( data.hasOwnProperty(db_table) && data[db_table].hasOwnProperty(db_column) ) {
						clientField.value = data[db_table][db_column];
					}
				}
			}
		}
	}
	return clientConfig;
};
