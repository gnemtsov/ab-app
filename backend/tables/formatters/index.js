'use strict';

//IMPORTANT! Formatters' output is placed as HTML and must be safe!

module.exports.departmentLinker = (col, row) => `<a href="/edit?d_id=${row.d_id}">${row[col.name]}</a>`;

module.exports.backendTestFormatter = (col, row) => `<b>${2 + 2}</b>`;