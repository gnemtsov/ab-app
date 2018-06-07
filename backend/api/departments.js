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
		try {
			FORM.getAsObject('departments')
				.then( (formData) => {
					callback(null, HTTP.response(200, formData));
				})
				.catch( (httpErrResopnse) => {
					console.log(httpErrResponse);
					callback(null, httpErrResponse);
				});
		} catch(error) {
			console.log(error);
		}
	};

    api.test = {};
    //Method: GET
    //Params: -
    //Returns form config for adding department
    api.test.GET = api.add.GET;
    api.test.POST = (event, context, callback) => {
		console.log(event.body);
		try {
			const data = JSON.parse(event.body);
			const validationResult = FORM.isValid('departments', data);
			console.log(validationResult);
			if (validationResult === true) {
				DB.then( conn => {
					conn.execute(
						'INSERT INTO `departments` (`d_title`, `d_head`, `d_size`, `d_created`) VALUES (?, ?, ?, ?);',
						[data.title, data.head, data.size, data.created]
					).then( () => {
						return callback(null, HTTP.response(200));
					});
				});
			} else {
				return callback(null, HTTP.response(400, validationResult));
			}
		} catch(error) {
			console.log(error);
		}
	};

    api.edit = {};
    //Method: GET
    //Params: id
    //Returns form config for editing department with specified id
	api.edit.GET = (event, context, callback) => {
		if ( !event.queryStringParameters.hasOwnProperty('id') ) {
			return callback(null, HTTP.response(400));
		}
		
		const id = event.queryStringParameters['id'];

		FORM.getAsObject('departments', [id])
			.then( (formData) => {
				console.log(formData);
				return callback(null, HTTP.response(200, formData));
			})
			.catch( () => {
				console.log('error');
				return callback(null, HTTP.response(500));
			});
	}

    return api;
}
