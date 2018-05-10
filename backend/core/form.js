'use strict';

const clientJSON = (formName) => {
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
		
		if ( field.hasOwnProperty('value') ) {
			clientField.value = field.value;
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
	}
	return clientConfig;
};

module.exports = {
	clientJSON: clientJSON
};
