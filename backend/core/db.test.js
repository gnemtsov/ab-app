const DB = require('./db');
const mysql = require('mysql2/promise');

describe('core/db', () => {
	it('connects once', () => {
		expect(DB.connection).toBeNull();
		const conn = DB.connect();
		conn.then( () => {
			expect(DB.connection).not.toBeNull();
			expect(mysql.createConnection.mock.calls.length).toBe(1);
			return DB.connect()
		}).then( () => {
			expect(mysql.createConnection.mock.calls.length).toBe(1);
		});
	});
});
