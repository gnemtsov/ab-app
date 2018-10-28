'use strict';

/******************************************************************/
/*********************Departments API: Add*************************/
/******************************************************************/

const { DB, HTTP, FORM } = require('core/index');

//Method: GET
//Params: -
//Returns form fields for adding new department
module.exports.GET = (event, context, callback) => {
	FORM.getAsObject('department', [0])
		.then(fields => callback(null, HTTP.response(200, fields)));
};

//Method: POST
//Params: d_title, d_head, d_size, d_created
//Inserts new department
module.exports.POST = (event, context, callback) => {
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

			DB.connect().then(conn => conn.execute(sql, params))
				.then(() => callback(null, HTTP.response(200)));
		});
};
