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

DBC.getInsertQuery = (tableName, cols, data, onDuplicate) => {
    //TODO onDuplicate
    return {
        sql: `
            INSERT into ${tableName} (${cols.join(', ')}) 
            VALUES (${cols.map(col => '?').join(', ')})
        `,
        params: cols.map(col => data[col])
    }
}

DBC.getUpdateQuery = (tableName, cols, data, condition = '1=1') => {
    return {
        sql: `
            UPDATE ${tableName}
            SET (${cols.map(col => col + ' = ?').join(', ')})
            WHERE ${condition}
        `,
        params: cols.map(col => data[col])
    }
}


module.exports = DBC;
