'use strict';

/******************************************************************/
/***************************SecretAPI******************************/
/******************************************************************/

module.exports = (HTTP, DB) => {
    
    let api = {};

    api.secret = (event, context, callback) => {
        return callback(null, HTTP.response(200, event.userData))
    }

    return api;
}