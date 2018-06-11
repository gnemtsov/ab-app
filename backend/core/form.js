'use strict';

const fs = require("fs");
const DB = require('core/db');
const VALIDATORS = require('forms/validators');

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

    //prepare validators for frontend
    let fields = require(`forms/${formName}.json`); //fields
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
};

exports.isValid = (formName, data) => {
    const fields = require(`forms/${formName}.json`);

    for (const field of fields) {
        const {
            name,
            required,
            type,
            allowedValues,
            validators
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
    }

    return true;
};
