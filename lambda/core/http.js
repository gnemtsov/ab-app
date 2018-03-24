'use strict';

exports.response = (code = 200, body = {}) => {

    if([400, 401, 403, 404, 500].indexOf(code) !== -1 && body.error === undefined){
        switch(code){
            case 400: body.error = 'Bad request (invalid content or params)'; break;
            case 401: body.error = 'Not authorized'; break;
            case 403: body.error = 'Not authenticated'; break;
            case 404: body.error = 'Resource not found'; break;
            case 500: body.error = 'Unexpected internal error'; break;
        }
    }

    return {
        statusCode: code,
        headers: { 
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "x-access-token",
            "Access-Control-Allow-Origin" : "*" 
        },
        body: JSON.stringify(body)
    }
}