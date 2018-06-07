'use strict';

const fs = require("fs");
const DB = require('core/db');
const VALIDATORS = require('forms/validators');

exports.getAsObject = (formName, params) => {
	// Loading backend config from file
	const backendConfig = require(`forms/${formName}.json`);

	// If no "params" object was given, no DB call will happen
	let dataPromise = Promise.resolve(null);
	// Otherwise load data from DB
	if (params !== undefined) {
		const sql = fs.readFileSync(`forms/sql/${formName}.sql`, 'utf8');

		dataPromise = DB.then(conn => conn.execute(sql, params))
			.then(([rows, fields]) => {
				// rows.length must be 0 or 1
				if (rows.length > 0) {
					return rows[0];
				} else {
					return null;
				}
			});
	}

	return dataPromise
		.then( (data) => {			
			let frontendConfig = [];
			for (const backendField of backendConfig) {
				
				const frontendField = {};
				frontendConfig.push(frontendField);
				
				if (data) {
					if (backendField.hasOwnProperty('backend')) {
						if (backendField.backend.hasOwnProperty('db_column')) {
							if (data.hasOwnProperty(backendField.backend.db_column)) {
								frontendField.value = data[ backendField.backend.db_column ];
							}
						}						
					}
				}
					
				for (const propertyName in backendField) {
					
					if ( propertyName === 'backend') {
						continue;
					}
					
					if ( !backendField.hasOwnProperty(propertyName) ) {
						continue;
					}

					const backendProperty = backendField[propertyName];
					
					if (propertyName === 'validators') {
						if ( !frontendField.hasOwnProperty('validators') ) {
							frontendField.validators = [];
						}
						
						for (const validatorName in backendProperty) {
							
							const validatorFrontend = {};
							const validatorBackend = VALIDATORS[ validatorName ];
							const paramsFrontend = backendProperty[validatorName].slice(1);
							
							validatorFrontend.message = backendProperty[validatorName][0];
							validatorFrontend.f = validatorBackend.toString();
							if (paramsFrontend.length > 0) {
								validatorFrontend.params = paramsFrontend;
							}

							frontendField.validators.push(validatorFrontend);
						}
						
						continue;
					}
					
					frontendField[propertyName] = backendProperty;
				}
			}
			return frontendConfig;
		});
};

exports.isValid = (formName, data) => {
	const backendConfig = require(`forms/${formName}.json`);
	
	for (const backendField of backendConfig) {
		// TODO
		const {
			name,
			required,
			type,
			allowedValues,
			validators
		} = backendField;
		
		if ( !data.hasOwnProperty(name) && required) {
			// not ok
			return exports.invalidField(name, 'Field not found');
		}
		
		let wrongType = false;
		switch (type) {
			case 'String':
			case 'Text':
				wrongType = (typeof data[name]) !== 'string';
				break;
			case 'Number':
				wrongType = !(/^[1-9]{1}[0-9]*$/.test(data[name]));
				break;
			case 'Boolean':
				wrongType = (data[name] !== true) && (data[name] !== false);
				break;
			default:
				wrongType = true;
		}
		
		if (wrongType) {
			// not ok
			return exports.invalidField(name, 'Wrong type');	
		}
		
		if (allowedValues) {
			if ( !allowedValues.includes(data[name]) ) {
				// not ok
				return exports.invalidField(name, 'Wrong value');	
			}
		}
		
		let validatorFail = null;
		for (const validatorName in validators) {
			const validatorData = validators[validatorName];
			const validator = VALIDATORS[validatorName];

			const params = validatorData.slice(1);
			const validationResult = validator( data[name], ...params );
			if (validationResult !== true) {
				validatorFail = validatorData[0];
				break;
			}
		}
		if (validatorFail !== null) {
			// not ok
			return exports.invalidField(name, validatorFail);			
		}
	}
	
	return true;
};

exports.invalidField = (name, message) => {
    return {
        field: {
            name,
            message
        }
    }
}
