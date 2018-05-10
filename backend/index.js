'use strict';

const jwt = require('jsonwebtoken');

//process.env.PROD and other env.vars are set in production only
if(process.env.PROD === undefined){
    process.env.PROD = 0;
    process.env.SECRET = 'SOME_SECRET_CODE_672967256';
    process.env.DB_HOST = '192.168.1.67';
    process.env.DB_NAME = 'abapp';
    process.env.DB_USER = 'abapp';
    process.env.DB_PASSWORD = 'abapp';
}

//core modules
const {DB, HTTP, FORM} = require('core/index');

//main handler
exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    let api;
    const [resource, action] = event.pathParameters['proxy'].split('/');
    const method = event.httpMethod;

    //OPTIONS requests are proccessed by API GateWay using mock
    //sam-local can't do it, so for local development we need this 
    if(method === 'OPTIONS'){
        return callback(null, HTTP.response());
    }  

    //require resource module
    try {
        api = require('api/' + resource)();
    } catch(e) {
        if (e.code === 'MODULE_NOT_FOUND') {
            return callback(null, HTTP.response(404, {error: 'Resource not found.'}));
        }
        return callback(null, HTTP.response(500));
    }

    //call resource action
    /*if(api.hasOwnProperty(action)) {

        if(api[action].protected === 0){
            api[action][method](event, context, callback);               
        } else if (event.headers['X-Access-Token'] !== undefined) {
            let token = event.headers['X-Access-Token'];
            try {
                event.userData = jwt.verify(token, process.env.SECRET);
                api[action][method](event, context, callback);         
            } catch(error) {
                return callback(null, HTTP.response(403, {error: 'Failed to verify token.'}));                
            }
        } else {
            return callback(null, HTTP.response(403, {error: 'No token provided.'}));        
        }
    } else {
        return callback(null, HTTP.response(404, {error: 'Action not found.'}));        
    }*/
    
    console.log(api);
    console.log(action);
    console.log(method);
    if(api.hasOwnProperty(action)) {
		// Check token for protected action
		if(api[action].protected === 1){
			if (event.headers['X-Access-Token'] === undefined) {
				return callback(null, HTTP.response(403, {error: 'No token provided.'}));   
			}
            try {
                event.userData = jwt.verify(token, process.env.SECRET);       
            } catch(error) {
                return callback(null, HTTP.response(403, {error: 'Failed to verify token.'}));                
            }
		}
		
		// Check if this method is not allowed
		if (!api[action].hasOwnProperty(method)) {
			return callback(null, HTTP.response(405), {error: 'Method not allowed.'});
		}
		
		return api[action][method](event, context, callback); 
	}
	return callback(null, HTTP.response(404, {error: 'Action not found.'}));
}
