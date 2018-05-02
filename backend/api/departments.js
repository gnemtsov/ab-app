'use strict';

/******************************************************************/
/************************DepartmentsAPI****************************/
/******************************************************************/

module.exports = (HTTP, DB) => {

    let api = {};

    //Method: GET
    //Params: -
    //Returns departments list for authenticated users
    api.list = (event, context, callback) => {
        DB.query(
            'SELECT * FROM departments ORDER BY d_title',

            (error, result) => {
                if (error) return callback(null, HTTP.response(500));
                else return callback(null, HTTP.response(200, result));
            }
        );
    }

    return api;
}