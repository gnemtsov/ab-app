'use strict';

exports.departmentLink = row => `<a href="/departments/${row.d_id}">${row.d_title}</a>`;

