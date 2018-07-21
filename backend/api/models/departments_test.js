'use strict';

const { DB, HTTP, FORM } = require('../../core/index');

const departments = require('../../models/departments');

module.exports.POST = (event, context, callback) => {
	departments.getById(1)
		.then(rows => {
			console.log(rows);
			callback(null, HTTP.response(200, rows ? rows : {}));
		});
};
module.exports.POST.open = 1;
