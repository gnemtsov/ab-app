'use strict';

/******************************************************************/
/************************Departments API***************************/
/******************************************************************/

const { DB, HTTP, FORM, TABLE } = require('core/index');

module.exports = () => {

    let api = {};

    //--------------------------------------------->departments/list
    api.list = {};

    //Method: GET
    //Params: -
    //Returns departments list table
    api.list.GET = (event, context, callback) => {
        TABLE.getAsObject('departments')
            .then(table => callback(null, HTTP.response(200, table)));
    }

    //--------------------------------------------->departments/add
    api.add = {};

    //Method: GET
    //Params: -
    //Returns form fields for adding new department
    api.add.GET = (event, context, callback) => {
        FORM.getAsObject('department', [0])
            .then(fields => callback(null, HTTP.response(200, fields)));
    };

    //Method: POST
    //Params: d_title, d_head, d_size, d_created
    //Inserts new department
    api.add.POST = (event, context, callback) => {
        const values = JSON.parse(event.body);

        FORM.isValid('department', values)
			.then( validationResult => {
				if (validationResult !== true) {
					return callback(null, HTTP.response(400, validationResult));
				}

				const sql = `
					INSERT into departments (d_title, d_head, d_created, d_size) 
					VALUES (?, ?, ?, ?)
				`;
				const params = [values['d_title'], values['d_head'], values['d_created'], values['d_size']];

				DB.then(conn => conn.execute(sql, params))
					.then(() => callback(null, HTTP.response(200)));
			});
    };

    //--------------------------------------------->departments/edit    
    api.edit = {};
    
    //Method: GET
    //Params: d_id
    //Returns form config for editing department with specified d_id
    api.edit.GET = (event, context, callback) => {
        const d_id = event.queryStringParameters['d_id'];
        if (d_id === undefined) {
            return callback(null, HTTP.response(400));
        }

        FORM.getAsObject('department', [d_id])
            .then(fields => callback(null, HTTP.response(200, fields)));
    }

    //Method: POST
    //Params: d_id, d_title, d_head, d_size, d_created
    //Edit department
    api.edit.POST = (event, context, callback) => {
        const values = JSON.parse(event.body);

        FORM.isValid('department', values)
			.then( validationResult => {
				if (validationResult !== true) {
					return callback(null, HTTP.response(400, validationResult));
				}

				const sql = `
					UPDATE departments
					SET d_title = ?, d_head = ?, d_created = ?, d_size = ?
					WHERE d_id = ?
					LIMIT 1
				`;
				const params = [values['d_title'], values['d_head'], values['d_created'], values['d_size'], values['d_id']];
				
				DB.then(conn => conn.execute(sql, params))
					.then(() => callback(null, HTTP.response(200)));
			});
    };

    return api;
}
