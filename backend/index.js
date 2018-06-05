'use strict';

const jwt = require('jsonwebtoken');

//process.env.PROD is set in production only
if (process.env.PROD === undefined) {
    require('dotenv').config();
}

//core modules
const { DB, HTTP, FORM } = require('core/index');

//main handler
exports.handler = (event, context, callback) => {

    //global error handler
    const handleFatalError = (err) => {
        console.error('Global error handler------------->', err, '<-------------');
        callback(null, HTTP.response(500, {
            error: (process.env.PROD === 'true' ? 'Something went wrong' : {
                message: err.message,
                stack: err.stack
            })
        }));
    };

    process.on('unhandledRejection', (reason, p) => {
        handleFatalError(reason);
    });

    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let api;
        const [resource, action] = event.pathParameters['proxy'].split('/');
        const method = event.httpMethod;

        //OPTIONS requests are proccessed by API GateWay using mock
        //sam-local can't do it, so for local development we need this 
        if (method === 'OPTIONS') {
            return callback(null, HTTP.response(200));
        }

        //require resource module
        try {
            api = require('api/' + resource)();
        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND') {
                return callback(null, HTTP.response(404, { error: 'Resource not found.' }));
            }
            throw e;
        }

        //call resource action
        if (api.hasOwnProperty(action)) {
            //check token for protected action
            if (api[action].protected === 1) {
                if (event.headers['X-Access-Token'] === undefined) {
                    return callback(null, HTTP.response(403, { error: 'No token provided.' }));
                }
                try {
                    event.userData = jwt.verify(token, process.env.SECRET);
                } catch (error) {
                    return callback(null, HTTP.response(403, { error: 'Failed to verify token.' }));
                }
            }

            // check if this method is not allowed
            if (!api[action].hasOwnProperty(method)) {
                return callback(null, HTTP.response(405), { error: 'Method not allowed.' });
            }

            //finally call the api
            return api[action][method](event, context, callback);
        }
        return callback(null, HTTP.response(404, { error: 'Action not found.' }));
    } catch (err) {
        handleFatalError(err);
    }
}
