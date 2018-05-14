'use strict';

exports.getAsObject = (formName, data) => {
	// Loading full config from file
	const fullConfig = require('forms/configs/' + formName + '.json');

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
};
