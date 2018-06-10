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
<<<<<<< HEAD
        FORM.getAsObject('department', [0])
            .then(fields => callback(null, HTTP.response(200, fields)));
    };

    //Method: POST
    //Params: -
    //Inserts new department
    api.add.POST = (event, context, callback) => {
        const formData = JSON.parse(event.body);
=======
		FORM.getAsObject('departments')
			.then( (formData) => {
				callback(null, HTTP.response(200, formData));
			})
	};

    api.test = {};
    //Method: GET
    //Params: -
    //Returns form config for adding department
    api.test.GET = api.add.GET;
    api.test.POST = (event, context, callback) => {
		const data = JSON.parse(event.body);
		const validationResult = FORM.isValid('departments', data);
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
	};
>>>>>>> 03db6d012aa10cc278f32853f44148d4fba60c2a

        const validationResult = FORM.isValid('department', formData);
        if (validationResult !== true) {
            return callback(null, HTTP.response(400, validationResult));
        }

        const cols = ['d_title', 'd_head', 'd_size', 'd_created'];
        const query = DB.getInsertQuery('departments', cols, formData);

        DB.then(conn => conn.execute(query.sql, query.params))
            .then(() => callback(null, HTTP.response(200)));
    };

    //--------------------------------------------->departments/edit    
    api.edit = {};
    
    //Method: GET
<<<<<<< HEAD
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
    //Params: -
    //Inserts new department
    api.add.POST = (event, context, callback) => {
        const formData = JSON.parse(event.body);

        const validationResult = FORM.isValid('department', formData);
        if (validationResult !== true) {
            return callback(null, HTTP.response(400, validationResult));
        }

        const cols = ['d_title', 'd_head', 'd_size', 'd_created'];
        const query = DB.getInsertQuery('departments', cols, formData);

        DB.then(conn => conn.execute(query.sql, query.params))
            .then(() => callback(null, HTTP.response(200)));
    };


=======
    //Params: id
    //Returns form config for editing department with specified id
	api.edit.GET = (event, context, callback) => {
		if ( !event.queryStringParameters.hasOwnProperty('id') ) {
			return callback(null, HTTP.response(400));
		}
		
		const id = event.queryStringParameters['id'];

		FORM.getAsObject('departments', [id])
			.then( (formData) => {
				return callback(null, HTTP.response(200, formData));
			})
	}
>>>>>>> 03db6d012aa10cc278f32853f44148d4fba60c2a

    return api;
}
