'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');

//process.env.PROD is set in production only
if (process.env.PROD === undefined) {
    require('dotenv').config();
}

//core modules
const { HTTP } = require('core/index');

//Needed for global error handler 
Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
Error.stackTraceLimit = 20;

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
exports.handler = (event, context, callback) => {

    console.log(`| C ---> ${event.httpMethod} ---> ${event.pathParameters['proxy']}`);

    //global error handler
    const handleFatalError = (err, type) => {
        console.error(`| >>>>>> ${type} <<<<<<`)
        console.error(`| ${err.message}`);
        err.stack.forEach(c => {
            console.error(`| ${c.getLineNumber()}:${c.getColumnNumber()} ${c.getEvalOrigin()}`);
        });
        console.error(`| <<<<<< ${type.replace(/.+?/g, '-')} >>>>>>`);

        // if c.getThis() returns a cyclic object,
        // error would be thrown in callback, and client would get 502.
        // TODO: do something
        const errorInfo = buildErrorInfo(err);
        // TODO: log errorInfo to S3

        callback(null, HTTP.response(500, {
            error: (process.env.PROD === 'true' ? 'Something went wrong' : errorInfo)
        }));
    };

    if (process.listenerCount('unhandledRejection') === 0) {
        process.on('unhandledRejection', (reason, p) => {
            handleFatalError(reason, 'unhandledRejection');
        });
    }

    if (process.listenerCount('uncaughtException') === 0) {
        process.on('uncaughtException', (err) => {
            handleFatalError(err, 'uncaughtException');
        });
    }

    if (process.listenerCount('warning') === 0) {
        process.on('warning', (warn) => {
            // TODO: save warning to S3 (or somewhere else)
            console.log(buildErrorInfo(warn));
        });
    }

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
        const resourcePath = 'api/' + resource;
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
            if (event.headers['Authorization'] === undefined) {
                return callback(null, HTTP.response(403, { error: 'No token provided.' }));
            }
            try {
                const token = event.headers['Authorization'].split(' ')[1];
                console.log(token);
                event.userData = jwt.verify(token, process.env.SECRET);
            } catch (error) {
                return callback(null, HTTP.response(403, { error: 'Failed to verify token.' }));
            }
        }

        //finally call the api
        return actionObj[method](event, context, callback);
    } catch (err) {
        handleFatalError(err);
    }
}
