'use strict';

const mysql = require('mysql2/promise');

//database connection
if (typeof DBC === 'undefined' || DBC === null) {
    var DBC = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });
}

module.exports = DBC;