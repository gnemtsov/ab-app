'use strict';

exports.response = (code = 200, body = {}) => {
    if([400, 401, 403, 404, 405, 500].indexOf(code) !== -1 && body.error === undefined){
        switch(code){
            case 400: body.error = 'Bad Request'; break;
            case 401: body.error = 'Unauthorized'; break;
            case 403: body.error = 'Forbidden'; break;
            case 404: body.error = 'Not Found'; break;
            case 405: body.error = 'Method Not Allowed'; break;
            case 500: body.error = 'Internal Server Error'; break;
        }
    }

    console.log(`| C <--- ${code} ${body.error || 'OK[data:' + Object.keys(body).length + ']'} <--- L`);

    const functionReplacer = (key, val) => typeof val === 'function' ? val.toString() : val;
    return {
        statusCode: code,
        headers: { 
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "x-access-token, Content-Type",
            "Access-Control-Allow-Origin" : "*" 
        },
        body: JSON.stringify(body, functionReplacer)
    }
}