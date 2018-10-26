'use strict';

/******************************************************************/
/*********************Departments API: List************************/
/******************************************************************/

const { HTTP, TABLE } = require('core/index');

//Method: GET
//Params: -
//Returns departments list table
module.exports.GET = (event, context, callback) => {
    TABLE.getAsObject('departments')
        .then(table => callback(null, HTTP.response(200, table)));
};
