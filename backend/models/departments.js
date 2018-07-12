`use strict`;

const DB = require('../core/db.js');

// Returns:
//     rejected promise - db error
//     promise null     - not found
//     promise Object   - found
module.exports.getById = id => {
	return DB.then(
		conn => conn.execute('SELECT * FROM `departments` WHERE d_id = ?', [id])
	)
	.then( data => {
		if (data[0].length > 0) {
			return data[0][0];
		} else {
			return null;
		}
	})
}
