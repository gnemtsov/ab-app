'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');

//core modules
const HTTP = require('./http');

const buildErrorInfo = (err) => {
    return {
        message: err.message,
        stack: err.stack.map((c) => {
            return {
                This: c.getThis(),
                TypeName: c.getTypeName(),
                FunctionName: c.getFunctionName(),
                MethodName: c.getMethodName(),
                FileName: c.getMethodName(),
                LineNumber: c.getLineNumber(),
                ColumnNumber: c.getColumnNumber(),
                EvalOrigin: c.getEvalOrigin(),
                IsToplevel: c.isToplevel(),
                IsEval: c.isEval(),
                IsNative: c.isNative(),
                IsConstructor: c.isConstructor()
            };
        })
    };
}

//main handler
module.exports = (apiPath) => (event, context, callback) => {

    console.log(`| C ---> ${event.httpMethod} ---> ${event.pathParameters['proxy']}`);

    //Needed for global error handler 
    Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
    Error.stackTraceLimit = 20;

    //global error handler
    const handleFatalError = (err) => {
        console.error('| error catched >>>>>>', err, '<<<<<<');
        // if c.getThis() returns a cyclic object,
        // error would be thrown in callback, and client would get 502.
        // TODO: do something
        const errorInfo = buildErrorInfo(err);
        // TODO: log errorInfo to S3
        
        callback(null, HTTP.response(500, {
            error: (process.env.PROD === 'true' ? 'Something went wrong' : errorInfo)
        }));
    };

    process.on('unhandledRejection', (reason, p) => {
        handleFatalError(reason);
    });

    process.on('uncaughtException', (err) => {
        handleFatalError(err);
    });

    process.on('warning', (warn) => {
        // TODO: save warning to S3 (or somewhere else)
        console.log(buildErrorInfo(warn));
    });

    context.callbackWaitsForEmptyEventLoop = false;

    try {
        //Method
        //OPTIONS requests are proccessed by API GateWay using mock
        //sam-local can't do it, so for local development we need this callback
        const method = event.httpMethod;
        if (method === 'OPTIONS') {
            return callback(null, HTTP.response(200));
        }

        //Extract resource and action from path params
        const [resource, action] = event.pathParameters['proxy'].split('/');

        // Require action from API if it exists
        const resourcePath = apiPath + '/' + resource;
        if (!fs.existsSync(resourcePath)) {
            return callback(null, HTTP.response(404, { error: 'Resource not found.' }));
        }
        const actionPath = resourcePath + '/' + action + '.js';
        if (!fs.existsSync(actionPath)) {
            return callback(null, HTTP.response(404, { error: 'Action not found.' }));
        }
        const actionObj = require(actionPath);

        //call resource action
        if (!actionObj.hasOwnProperty(method)) {
            return callback(null, HTTP.response(405));
        }

        //check token for protected action
        if (actionObj[method].open !== 1) {
            if (event.headers['X-Access-Token'] === undefined) {
                return callback(null, HTTP.response(403, { error: 'No token provided.' }));
            }
            try {
                const token = event.headers['X-Access-Token'];
                event.userData = jwt.verify(token, process.env.SECRET);
            } catch (error) {
                return callback(null, HTTP.response(403, { error: 'Failed to verify token.' }));
            }
        }
        
        if (actionObj[method].protected === 1) {
			if (event.headers['X-Secret-Key'] !== process.env.SECRET_KEY) {
				return callback(null, HTTP.response(403, { error: 'Wrong secret key provided' }));
			}
		}

        //finally call the api
        return actionObj[method](event, context, callback);
    } catch (err) {
        handleFatalError(err);
    }
}
