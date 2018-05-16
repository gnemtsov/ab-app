'use strict';

/******************************************************************/
/************************Departments API***************************/
/******************************************************************/
const fs = require("fs");
const {DB, HTTP, FORM} = require('core/index');

module.exports = () => {

    let api = {};

	api.list = {};
    //Method: GET
    //Params: -
    //Returns departments list for authenticated users
    api.list.GET = (event, context, callback) => {
        DB.query(
            'SELECT * FROM `departments` ORDER BY d_id',

            (error, result) => {
                if (error) {
                    return callback(null, HTTP.response(500));
                } else {
                    let table = {
                        conf: {
                            selectable: true
                        },
                        cols: require('tables/descriptions/departments.json'),
                        rows: result
                    };
                    return callback(null, HTTP.response(200, table));
                }
            }
        );
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
	
	api.edit = {};
	//Method: GET
	//Params: id
	//Returns form config for editing department with specified id
	api.edit.GET = (event, context, callback) => {
		if ( !event.queryStringParameters.hasOwnProperty('id') ) {
			return callback(null, HTTP.response(400));
		}
		
		const id = event.queryStringParameters['id'];

		FORM.getAsObject('departments', id)
			.then( (formData) => {
				callback(null, HTTP.response(200, formData));
			})
			.catch( (httpErrResopnse) => {
				callback(null, httpErrResponse);
			});
	}

    return api;
}
