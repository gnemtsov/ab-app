'use strict';

const jwt = require('jsonwebtoken');

//process.env.PROD is set in production only
if (process.env.PROD === undefined) {
    require('dotenv').config();
}

//core modules
const { DB, HTTP, FORM } = require('core/index');

const buildErrorInfo = (err) => {
	return {
		message: err.message,
		stack: err.stack.map( (c) => {
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
	//Needed for global error handler 
	Error.prepareStackTrace = (err, structuredStackTrace) => structuredStackTrace;
	Error.stackTraceLimit = 20;
	
    //global error handler
    const handleFatalError = (err) => {
        console.error('Global error handler------------->', err, '<-------------');
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
		console.log( buildErrorInfo(warn) );
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

        //require resource module
        let api;
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
