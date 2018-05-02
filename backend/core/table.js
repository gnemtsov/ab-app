'use strict';

const fs = require("fs");
const { DB } = require('index');

exports.getAsObject = tableName => {

    const description = JSON.parse(fs.readFileSync(`tables/descriptions/${tableName}.json`, 'utf8'));
    const sql = fs.readFileSync(`tables/sql/${tableName}.sql`, 'utf8');

    let table = {
        rows: [],
        cols: [],
        order: []
    };

    //make cols and order arrays
    //TODO

    //get data from database
    DB.query(
        sql,

        (error, result) => {
            if (error) {
                throw error;
            } else {
                ////build array with results
                //TODO 
                return table;
            }
        }
    );   
}