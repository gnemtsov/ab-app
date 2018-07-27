'use strict';

const mysql = require('mysql2/promise');

module.exports = {
    connection: null,
    connect() {
        if (this.connection === null) {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
        }

        return this.connection;
    }
}
