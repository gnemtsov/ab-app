'use strict';

const fs = require('fs');
const DB = require('core/db');
const FORMATTERS = require('tables/formatters');

exports.getAsObject = (tableName, params = []) => {
    const sql = fs.readFileSync(`tables/sql/${tableName}.sql`, 'utf8');
    const dbFetchPromise = DB.then(conn => conn.execute(sql, params));

    const cols = require(`tables/${tableName}.json`);

    const whiteList = ['name', 'title', 'defaultContent', 'sortOrder', 'sortDirection', 'frontendFormatter', 'html'];
    const frontendCols = cols.map(col => {
        let frontendCol = {};
        for (const key of whiteList) {
            frontendCol[key] = col[key];
        }
        return frontendCol;
    });

    return dbFetchPromise.then(([rows]) => {
        const frontendRows = rows.map(row => {
            let frontendRow = {};
            for (const col of cols) {
                frontendRow[col.name] =
                    col.backendFormatter ?
                        FORMATTERS[col.backendFormatter](col, row) :
                        row[col.name];
            }
            return frontendRow;
        });

        return { cols: frontendCols, rows: frontendRows };
    });
}
