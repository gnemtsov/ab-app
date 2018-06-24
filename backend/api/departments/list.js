'use strict';

/******************************************************************/
/*********************Departments API: List************************/
/******************************************************************/

const { DB, HTTP, FORM, TABLE } = require('core/index');

module.exports = () => {
	return {
		//Method: GET
		//Params: -
		//Returns departments list table
		GET: (event, context, callback) => {
			TABLE.getAsObject('departments')
				.then(table => callback(null, HTTP.response(200, table)));
		}
	};
}
