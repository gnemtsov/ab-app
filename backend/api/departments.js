'use strict';

/******************************************************************/
/************************Departments API***************************/
/******************************************************************/

const { DB, HTTP, FORM, TABLE } = require('core/index');

module.exports = () => {

    let api = {};

    api.list = {};
    //Method: GET
    //Params: -
    //Returns departments list for authenticated users
    api.list.GET = (event, context, callback) => {
        TABLE.getAsObject('departments')
            .then(table => callback(null, HTTP.response(200, table)));
    }

    api.add = {};
    //Method: GET
    //Params: -
    //Returns form config for adding department
    api.add.GET = (event, context, callback) => {
        const formData = FORM.clientJSON('departments');
        return callback(null, HTTP.response(200, formData));
    }

    api.test = {};
    //Method: GET
    //Params: -
    //Returns form config for adding department
    api.test.GET = (event, context, callback) => {
        const formData = require('../forms/configs/departments_frontend.json');
        return callback(null, HTTP.response(200, formData));
    }

    api.edit = {};
    //Method: GET
    //Params: id
    //Returns form config for editing department with specified id
    api.edit.GET = (event, context, callback) => {
        if (!event.queryStringParameters.hasOwnProperty('id')) {
            return callback(null, HTTP.response(422));
        }

        const id = event.queryStringParameters['id'];
        DB.execute(
            'SELECT * FROM `departments` WHERE d_id = ?',
            [id],

            (error, result) => {
                if (error) {
                    return callback(null, HTTP.response(500));
                } else {
                    if (result.length === 0) {
                        return callback(null, HTTP.response(404));
                    }

                    const formData = FORM.clientJSON('departments', {
                        departments: result[0]
                    });

                    return callback(null, HTTP.response(200, formData));
                }
            }
        );
    }

    return api;
}
