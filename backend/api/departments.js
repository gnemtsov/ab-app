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
        TABLE.getAsObject('departments', [13])
            .then(table => callback(null, HTTP.response(200, table)));
    }

    api.add = {};
    //Method: GET
    //Params: -
    //Returns form config for adding department
    api.add.GET = (event, context, callback) => {		
		FORM.getAsObject('departments')
			.then( (formData) => {
				callback(null, HTTP.response(200, formData));
			})
			.catch( (httpErrResopnse) => {
				callback(null, httpErrResponse);
			});
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
		if ( !event.queryStringParameters.hasOwnProperty('id') ) {
			return callback(null, HTTP.response(400));
		}
		
		const id = event.queryStringParameters['id'];

		FORM.getAsObject('departments', {departments: id})
			.then( (formData) => {
				callback(null, HTTP.response(200, formData));
			})
			.catch( (httpErrResopnse) => {
				callback(null, httpErrResponse);
			});
	}

    return api;
}
