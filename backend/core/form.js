'use strict';

const fs = require("fs");
const DB = require('core/db');
const VALIDATORS = require('forms/validators');

// tables - {"table_name_1": "row_id_1", "table_name_2": "row_id_2", ...}
// returns promise: Ok - frontendConfig, Error - HTTP response
exports.getAsObject = (formName, tables) => {
    // Loading backend config from file
    const backendConfig = require(`forms/configs/${formName}.json`);

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
            if (!tables.hasOwnProperty(tableName)) {
                continue;
            }

            let promise = new Promise((resolve, reject) => {
                fs.readFile(`forms/sql/${tableName}.sql`, 'utf8', (error, sql) => {
                    if (error) {
                        return reject(HTTP.response(500));
                    }
                    DB.execute(sql, [tables[tableName]], (error, result) => {
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
        dataPromise = Promise.all(DBPromises).then(() => data);
    }

    return dataPromise
        .then((data) => {
            let frontendConfig = {};
            for (const fieldName in backendConfig) {
                const backendField = backendConfig[fieldName];
                const frontendField = {};
                frontendConfig[fieldName] = frontendField;

                for (const propertyName in backendField) {

                    if (propertyName === 'backend') {
                        continue;
                    }

                    if (!backendField.hasOwnProperty(propertyName)) {
                        continue;
                    }

                    const backendProperty = backendField[propertyName];

                    if (propertyName === 'validators') {
                        if (!frontendField.hasOwnProperty('validators')) {
                            frontendField.validators = {};
                        }

                        for (const validatorName in backendProperty) {

                            const validatorFrontend = {};
                            const validatorBackend = VALIDATORS[validatorName];
                            const paramsFrontend = backendProperty[validatorName].slice(1);

                            validatorFrontend.message = backendProperty[validatorName][0];
                            validatorFrontend.f = validatorBackend.toString();
                            if (paramsFrontend.length > 0) {
                                validatorFrontend.params = paramsFrontend;
                            }


                            frontendField.validators[validatorName] = validatorFrontend;
                        }

                        continue;
                    }

                    frontendField[propertyName] = backendProperty;
                }
            }
            return frontendConfig;
        });
};

exports.getValidated = (formName, data) => {
    const backendConfig = require(`forms/configs/${formName}.json`);

    data.valid = true;
    const errorFields = {
        valid: false
    };

    for (const fieldName in backendConfig) {
        if (!backendConfig.hasOwnProperty(fieldName)) {
            // ok
            continue;
        }

        if (!data.hasOwnProperty(fieldName)) {
            // not ok
            errorFields[fieldName] = 'Field not found';
            data.valid = false;
            continue;
        }

        let wrongType = false;
        switch (backendConfig[fieldName].type) {
            case 'String':
            case 'Text':
                wrongType = (typeof data[fieldName]) !== 'string';
                break;
            case 'Number':
                wrongType = (typeof data[fieldName]) !== 'number';
                break;
            case 'Boolean':
                wrongType = (typeof data[fieldName]) !== 'boolean';
                break;
            default:
                wrongType = true;
        }

        if (wrongType) {
            // not ok
            errorFields[fieldName] = 'Wrong type';
            data.valid = false;
            continue;
        }

        if (backendConfig[fieldName].hasOwnProperty('allowedValues')) {
            if (!backendConfig[fieldName].allowedValues.includes(data[fieldName])) {
                // not ok
                errorFields[fieldName] = 'Wrong value';
                data.valid = false;
                continue;
            }
        }

        let validators = {};
        if (backendConfig[fieldName].hasOwnProperty('validators')) {
            for (const validatorName in backendConfig[fieldName].validators) {
                validators[validatorName] = backendConfig[fieldName].validators[validatorName];
            }
        }
        if (backendConfig[fieldName].hasOwnProperty('backend') && backendConfig[fieldName].backend.hasOwnProperty('validators')) {
            for (const validatorName in backendConfig[fieldName].backend.validators) {
                validators[validatorName] = backendConfig[fieldName].backend.validators[validatorName];
            }
        }

        let validatorFail = null;
        for (const validatorName in validators) {
            const validatorData = validators[validatorName];
            const validator = VALIDATORS[validatorName];

            const params = validatorData.slice(1);
            const validationResult = validator(data[fieldName], ...params);
            if (validationResult !== true) {
                validatorFail = validatorData[0];
                break;
            }
        }
        if (validatorFail !== null) {
            // not ok
            errorFields[fieldName] = validatorFail;
            data.valid = false;
            continue;
        }
    }

    if (data.valid) {
        return data;
    } else {
        return errorFields;
    }
};

exports.invalidField = (name, message) => {
    return {
        field: {
            name,
            message
        }
    }
}