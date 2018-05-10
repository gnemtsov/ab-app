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
                        cols: JSON.parse(fs.readFileSync(`tables/descriptions/departments.json`, 'utf8')),
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
		const formData = FORM.clientJSON('helloworld');
		return callback(null, HTTP.response(200, formData));
	}

    return api;
}
