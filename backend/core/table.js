'use strict';

const fs = require("fs");
const DB = require('core/db');

exports.getAsObject = tableName => {
    const sql = fs.readFileSync(`tables/sql/${tableName}.sql`, 'utf8');
    
	return new Promise( (resolve, reject) => {
		DB.query(
			sql,
			
			(error, sqlResult) => {
				if (error) {
					return reject(error);
				} else {
					const table = {
						cols: require(`tables/configs/${tableName}.json`)
					}

					let data = {
						rows: [],
						cols: [],
						order: []
					};

					//make cols and order arrays
					for (let i in table.cols) {
						const col = table.cols[i];
						
						if ( !table.cols.hasOwnProperty(i) ) {
							continue;
						}
						
						if ( col.sortOrder && col.sortDirection ) {
							if (!data.order[ col.sortOrder ]) {
								data.order[ col.sortOrder ] = {};
							}
							data.order[ col.sortOrder ][i] = col.sortDirection;
						}
						
						data.cols.push(col);
					}

					for (const row of sqlResult) {
						const dataRow = {};
						
						for (const col of data.cols) {
							dataRow[ col.name ] = row[ col.name ];
						}
						
						data.rows.push(dataRow);
					}
					resolve(data);
				}
			}
		);
	});
}
