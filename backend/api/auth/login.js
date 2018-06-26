'use strict';

/******************************************************************/
/***********************Auth API: Login****************************/
/******************************************************************/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const { DB, HTTP, FORM } = require('core/index');

//Method: GET
//Params: -
//Returns login form config
module.exports.GET = (event, context, callback) => {
	FORM.getAsObject('login')
		.then(fields => callback(null, HTTP.response(200, fields)));
};
module.exports.GET.open = 1;

//Method: POST
//Params: login, password
//Checks login and password, provides new tokens for valid user
module.exports.POST = (event, context, callback) => {
	const formData = JSON.parse(event.body);

	FORM.isValid('login', formData)
		.then( validationResult => {
			if (validationResult !== true) {
				return callback(null, HTTP.response(400, validationResult));
			}

			const { u_login, u_password } = formData;
			const sql = `
				SELECT u_id, u_login, u_firstname, u_lastname, u_password, u_timezone, u_access
				FROM users 
				WHERE u_login = ?
			`;

			DB.then(conn => conn.execute(sql, [u_login]))
				.then(([rows]) => {
					if (!rows.length) {
						return callback(null, HTTP.response(400, FORM.invalidField('login', 'User not found.')));
					} else if (rows[0].u_access !== 1) {
						return callback(null, HTTP.response(400, FORM.invalidField('login', 'Access for the user is blocked.')));
					} else if (!bcrypt.compareSync(u_password, rows[0].u_password)) {
						return callback(null, HTTP.response(400, FORM.invalidField('password', 'Wrong password.')));
					} else {
						const accessToken = jwt.sign(
							{
								login: rows[0].u_login,
								name: rows[0].u_lastname + ' ' + rows[0].u_firstname,
								timezone: rows[0].u_timezone
							},
							process.env.SECRET,
							{
								subject: rows[0].u_id.toString(),
								expiresIn: 60 * 60
							}
						);
						const refreshToken = randtoken.uid(256);
						const sql = `
							INSERT into refreshtokens(rt_user_id, rt_token, rt_created, rt_updated, rt_expires, rt_ip) 
							VALUES (${rows[0].u_id}, '${refreshToken}', NOW(), NOW(), NOW() + INTERVAL 1 MONTH, '${event.requestContext.identity.sourceIp}')
						`;

						DB.then(conn => conn.query(sql))
							.then(() =>
								callback(null, HTTP.response(200, { accessToken: accessToken, refreshToken: refreshToken }))
							);
					}
				});
		});
};
module.exports.POST.open = 1;
