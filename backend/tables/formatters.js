'use strict';

// Formatter returns:
// plain string - should be rendered as text
// object {html: "..."} - should be rendered as html


/*exports.departmentLink = () => row => {
	html: `<a href="/departments/${row.d_id}">${row.d_title}</a>`
};
exports.paramsTest = (x, y) => row => `${x} + ${y} = ${x+y}`;*/

module.exports.departmentLinker = (col, row) => ({__html:`<a href="/departments/${row.d_id}">${row[col.name]}</a>`});

exports.paramsTest = {
	params: ["x", "y"],
	f: function(x, y) {
		return function(row) {
			return x + ' + ' + y + ' = ' + (x+y);
		}
	}
}
