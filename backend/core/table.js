'use strict';

const fs = require('fs');
const DB = require('core/db');
const FORMATTERS = require('tables/formatters');

exports.getAsObject = (tableName, params=[]) => {
    const sql = fs.readFileSync(`tables/sql/${tableName}.sql`, 'utf8');

    return DB.then(conn => conn.execute(sql, params))
        .then(([rows]) => {
            const cols = require(`tables/${tableName}.json`);

            let table = {
                conf: {
                    selectable: true
                },
                cols: [],
                rows: [],
            };

            //prepare cols for frontend
            for (const col of cols) {
                let frontendCol = {};

                const whiteList = ['name', 'title', 'defaultContent', 'sortOrder', 'sortDirection', 'frontendFormatter'];
                for (const key of whiteList) {
                    if (col[key] !== undefined) {
                        frontendCol[key] =
                            key === 'frontendFormatter' ?
                                FORMATTERS[col[key]] :
                                col[key];
                    }
                }

                frontendCol.html = col['backendFormatter'] !== undefined;

                table.cols.push(frontendCol);
            }

            //prepare rows for frontend
            for (const row of rows) {
                const frontendRow = {};

                for (const col of cols) {
                    frontendRow[col.name] =
                        col.hasOwnProperty('backendFormatter') ?
                            FORMATTERS[col.backendFormatter](col, row) :
                            row[col.name];
                }

                table.rows.push(frontendRow);
            }

            return table;
        });
}
