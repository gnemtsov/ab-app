'use strict';

const fs = require("fs");
const DB = require('./db');
const U = require('./utils');
const VALIDATORS = require('../forms/validators');

//returns invalid field
const invalidField = (name, message) => {
    return {
        field: {
            name,
            message
        }
    }
};
exports.invalidField = invalidField;

//returns form fields
exports.getAsObject = (formName, params = []) => {
    let fields = require(`forms/${formName}.json`); //fields
    let dbPromises = [];

    //fetch fields values from DB
    const sqlFile = `forms/sql/${formName}.sql`; //sql
    if (fs.existsSync(sqlFile)) {
        const sql = fs.readFileSync(`forms/sql/${formName}.sql`, 'utf8');
        dbPromises.push(
            DB.connect().then(conn => conn.execute(sql, params))
                .then(([rows]) => {
                    if (rows.length === 1) {
                        fields.forEach(field => field.value = rows[0][field.name]);
                    }
                })
        );
    }

    //add DB validators
    dbPromises.push(addDBValidators(fields));

    return Promise.all(dbPromises).then(() => {
        fields.forEach(field => {
            if (field.validators !== undefined) {
                field.validators.forEach(validator => {
                    if (VALIDATORS[validator.name] !== undefined) {
                        validator.f = VALIDATORS[validator.name].toString();
                    }
                });
            }
        });
        return fields;
    });
};

//returns Promise (true|invalidField)
exports.isValid = (formName, data) => {
    const fields = require(`forms/${formName}.json`);
    return addDBValidators(fields)
        .then(() => {
            for (const field of fields) {
                const {
                    name: fieldName,
                    required,
                    validators = [],
                } = field;

                const value = data[fieldName];

                if (value === undefined || value === '') {
                    if (required) {
                        return invalidField(fieldName, 'Value is required');
                    } else {
                        continue;
                    }
                }

                if (validators.length) {
                    for (var i = 0; i < validators.length; i++) {
                        const { name: validatorName, message, params = [] } = validators[i];
                        if (!VALIDATORS[validatorName](value, ...params)) {
                            return invalidField(
                                fieldName,
                                message.replace(/%([0-9]+)%/g, (...args) => params[Number(args[1])])
                            );
                        }
                    }
                }
            }

            return true;
        });
};


/*-----Supplementary functions-----*/
//adds validators, based on info from SHOW COLUMNS query
const addDBValidators = (fields) => {
    const regexps = require('forms/dbs/mariadb');
    let dbPromises = [];
    let tablesList = [];
    for (const field of fields) {
        const table = field.table;
        if (table !== undefined && !tablesList.includes(table)) {
            tablesList.push(table);
            dbPromises.push(
                DB.connect().then(conn => conn.execute(`SHOW COLUMNS FROM ${table}`))
                    .then(([rows]) => {
                        let tableCols = {};
                        rows.forEach(col => tableCols[col.Field] = col);

                        fields.forEach(field => {
                            const col = tableCols[field.name];
                            if (field.table === table && col) {
                                for (const regexp of regexps) {
                                    const regexpResult = regexp.regexp.exec(col.Type);
                                    if (regexpResult) {
                                        const {
                                            type,
                                            allowedValues,
                                            validators = []
                                        } = regexp.f(regexpResult);

                                        if (field.type !== undefined && field.type !== 'Hidden' && field.type !== type) {
                                            throw new Error(`Field and db column types mismatch.`);
                                        }
                                        field.type = U.coalesce(field.type, type);

                                        field.allowedValues = U.coalesce(field.allowedValues, allowedValues);

                                        field.required = U.coalesce(
                                            field.required,
                                            col.Null === 'NO' && col.Default === null && col.Extra !== 'auto_increment'
                                        );

                                        field.validators =
                                            field.validators === undefined ?
                                                validators :
                                                validators.concat(field.validators);
                                        break;
                                    }
                                }
                            }

                        });
                    })
            );
        }
    }
    return Promise.all(dbPromises);
};
