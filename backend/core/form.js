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
		const fieldName = backendField.name;
		
		if ( !data.hasOwnProperty(fieldName) ) {
			// not ok
			return exports.invalidField(fieldName, 'Field not found');
		}
		
		let wrongType = false;
		switch (backendField.type) {
			case 'String':
			case 'Text':
				wrongType = (typeof data[fieldName]) !== 'string';
				break;
			case 'Number':
				wrongType = isNaN(data[fieldName]);
				break;
			case 'Boolean':
				wrongType = (data[fieldName] != 'true') && (data[fieldName] != 'false');
				break;
			default:
				wrongType = true;
		}
		
		if (wrongType) {
			// not ok
			return exports.invalidField(fieldName, 'Wrong type');	
		}
		
		if (backendField.hasOwnProperty('allowedValues')) {
			if ( !backendField.allowedValues.includes(data[fieldName]) ) {
				// not ok
				return exports.invalidField(fieldName, 'Wrong value');	
			}
		}
		
		let validators = {};
		if (backendField.hasOwnProperty('validators')) {
			for (const validatorName in backendField.validators) {
				validators[validatorName] = backendField.validators[validatorName];
			}
		}
		if (backendField.hasOwnProperty('backend') && backendField.backend.hasOwnProperty('validators')) {
			for (const validatorName in backendField.backend.validators) {
				validators[validatorName] = backendField.backend.validators[validatorName];
			}
		}
		
		let validatorFail = null;
		for (const validatorName in validators) {
			const validatorData = validators[validatorName];
			const validator = VALIDATORS[validatorName];

			const params = validatorData.slice(1);
			const validationResult = validator( data[fieldName], ...params );
			if (validationResult !== true) {
				validatorFail = validatorData[0];
				break;
			}
		}
		if (validatorFail !== null) {
			// not ok
			return exports.invalidField(fieldName, validatorFail);			
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
