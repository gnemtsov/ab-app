'use strict';

/******************************************************************/
/***********************Auth API: Token****************************/
/******************************************************************/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const { DB, HTTP, FORM } = require('core/index');

//Method: POST
//Params: login, refreshToken
//Provides new access token if provided refresh token is valid and belongs to specified user
module.exports.POST = (event, context, callback) => {
	const { sub, refreshToken } = JSON.parse(event.body);

	const sql = `
		SELECT rt_id, u_id, u_login, u_firstname, u_lastname, u_timezone
		FROM refreshtokens 
		LEFT JOIN users ON u_id = rt_user_id
		WHERE rt_user_id = ? AND rt_token = ? AND rt_expires > NOW()       
	`;

	DB.connect().then(conn => conn.execute(sql, [sub, refreshToken]))
		.then(([rows]) => {
			if (!rows.length || rows.length > 1) {
				return callback(null, HTTP.response(401, { error: 'Refresh token unknown, expired or ambigous.' }));
			} else {
				const newAccessToken = jwt.sign(
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
				const newRefreshToken = randtoken.uid(256);

				const sql = `
					UPDATE refreshtokens 
					SET rt_token = '${newRefreshToken}',
						rt_updated = NOW(),
						rt_ip =  '${event.requestContext.identity.sourceIp}'
					WHERE rt_id = ${rows[0].rt_id}
				`;

				DB.connect().then(conn => conn.query(sql))
					.then(() =>
						callback(null, HTTP.response(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }))
					);
			}

		});
};
module.exports.POST.open = 1;
