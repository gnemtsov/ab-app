'use strict';

/******************************************************************/
/***************************Auth API*******************************/
/******************************************************************/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');

const { DB, HTTP, FORM } = require('core/index');

module.exports = () => {

    let api = {};

    api.login = { protected: 0 }; //------------------------------------> auth/login resource
    //Method: GET
    //Params: -
    //Returns login form config
    api.login.GET = (event, context, callback) => {
        callback(null, HTTP.response(200, require('forms/configs/login.frontend.json')))
        //FORM.getAsObject('login')
        //      .then(data => callback(null, HTTP.response(200, data)));
    };

    //Method: POST
    //Params: login, password
    //Checks login and password, provides new tokens for valid user
    api.login.POST = (event, context, callback) => {
        const { login, password } = JSON.parse(event.body);

        const sql = `
            SELECT u_id, u_login, u_firstname, u_lastname, u_password, u_timezone, u_access
            FROM users 
            WHERE u_login = ?
        `;

        DB.then(conn => conn.execute(sql, [login]))
            .then(([rows, fields]) => {
                if (!rows.length) {
                    return callback(null, HTTP.response(400, FORM.invalidField('login', 'User not found.')));
                } else if (rows[0].u_access !== 1) {
                    return callback(null, HTTP.response(400, FORM.invalidField('login', 'Access for the user is blocked.')));
                } else if (!bcrypt.compareSync(password, rows[0].u_password)) {
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
    }

    api.token = { protected: 0 }; //------------------------------------> auth/token resource
    //Method: POST
    //Params: login, refreshToken
    //Provides new access token if provided refresh token is valid and belongs to specified user
    api.token.POST = (event, context, callback) => {
        const { sub, refreshToken } = JSON.parse(event.body);

        const sql = `
            SELECT rt_id, u_id, u_login, u_firstname, u_lastname, u_timezone
            FROM refreshtokens 
            LEFT JOIN users ON u_id = rt_user_id
            WHERE rt_user_id = ? AND rt_token = ? AND rt_expires > NOW()       
        `;

        DB.then(conn => conn.execute(sql, [sub, refreshToken]))
            .then(([rows, fields]) => {
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

                    DB.then(conn => conn.query(sql))
                        .then(() =>
                            callback(null, HTTP.response(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }))
                        );
                }

            });
    }

    return api;
}
