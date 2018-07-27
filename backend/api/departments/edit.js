'use strict';

/******************************************************************/
/*********************Departments API: Edit************************/
/******************************************************************/

const { DB, HTTP, FORM } = require('core/index');

//Method: GET
//Params: d_id
//Returns form config for editing department with specified d_id
module.exports.GET = (event, context, callback) => {
	const d_id = event.queryStringParameters['d_id'];
	if (d_id === undefined) {
		return callback(null, HTTP.response(400));
	}

	FORM.getAsObject('department', [d_id])
		.then(fields => callback(null, HTTP.response(200, fields)));
};

//Method: POST
//Params: d_id, d_title, d_head, d_size, d_created
//Edit department
module.exports.POST = (event, context, callback) => {
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
			
			DB.connect().then(conn => conn.execute(sql, params))
				.then(() => callback(null, HTTP.response(200)));
		});
};
