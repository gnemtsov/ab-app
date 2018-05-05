'use strict';

/******************************************************************/
/************************Departments API***************************/
/******************************************************************/
const fs = require("fs");
const {DB, HTTP} = require('core/index');

module.exports = () => {

    let api = {};

    //Method: GET
    //Params: -
    //Returns departments list for authenticated users
    api.list = (event, context, callback) => {
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

    return api;
}