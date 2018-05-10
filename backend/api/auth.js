'use strict';

/******************************************************************/
/***************************Auth API*******************************/
/******************************************************************/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const { DB, HTTP } = require('core/index');

module.exports = () => {

    let api = {};

	api.login = {};
    //Method: POST
    //Params: login, password
    //Checks login and password, provides new tokens for valid user
    api.login.POST = (event, context, callback) => {

		console.log(event.body);
        const { login, password } = JSON.parse(event.body);

        DB.execute(
            `SELECT u_id, u_login, u_firstname, u_lastname, u_password, u_timezone 
            FROM users 
            WHERE u_login = ? AND u_access = 1`,

            [login],

            (error, rows, fields) => {

                if (error) {
                    console.log(error);
                    return callback(null, HTTP.response(500));
                } else if (!rows.length) {
                    return callback(null, HTTP.response(403, { error: 'User not found.' }));
                } else if (!bcrypt.compareSync(password, rows[0].u_password)) {
                    return callback(null, HTTP.response(403, { error: 'Wrong password.' }));
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

                    DB.query(
                        `INSERT into refreshtokens(rt_user_id, rt_token, rt_created, rt_updated, rt_expires, rt_ip) 
                        VALUES (${rows[0].u_id}, '${refreshToken}', NOW(), NOW(), NOW() + INTERVAL 1 MONTH, '${event.requestContext.identity.sourceIp}')`,

                        (error, result) => {
                            if (error) return callback(null, HTTP.response(500));
                            else return callback(null, HTTP.response(200, {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }));
                        }
                    );

                }
            }
        );

    }
    api.login.protected = 0;

	api.token = {};
    //Method: POST
    //Params: login, refreshToken
    //Provides new access token if provided refresh token is valid and belongs to specified user
    api.token.POST = (event, context, callback) => {

        const { sub, refreshToken } = JSON.parse(event.body);

        DB.execute(
            `SELECT rt_id, u_id, u_login, u_firstname, u_lastname, u_timezone
           FROM refreshtokens 
           LEFT JOIN users ON u_id = rt_user_id
           WHERE rt_user_id = ? AND rt_token = ? AND rt_expires > NOW()`,

            [sub, refreshToken],

            (error, rows, fields) => {
                if (error) {
                    return callback(null, HTTP.response(500));
                } else if (!rows.length || rows.length > 1) {
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

                    DB.query(
                        `UPDATE refreshtokens 
                        SET rt_token = '${newRefreshToken}',
                            rt_updated = NOW(),
                            rt_ip =  '${event.requestContext.identity.sourceIp}'
                        WHERE rt_id = ${rows[0].rt_id}`,
                        (error, result) => {
                            if (error) return callback(null, HTTP.response(500));
                            else return callback(null, HTTP.response(200, {
                                accessToken: newAccessToken,
                                refreshToken: newRefreshToken
                            }));
                        }
                    );
                }
            }
        );

    }
    api.token.protected = 0;

    return api;
}
