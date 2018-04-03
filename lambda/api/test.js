'use strict';

/******************************************************************/
/***************************TestAPI********************************/
/******************************************************************/

module.exports = (HTTP, DB) => {
    
    let api = {};

    //Method: GET
    //Params: -
    //Returns some secret data for authenticated users
    api.secret = (event, context, callback) => {
        return callback(null, HTTP.response(200, event.userData))
    }

    return api;
}