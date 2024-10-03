const mysql = require('mysql2');

/**
 * Creates a MySQL connection pool.
 * @type {mysql.Pool}
 */
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

module.exports = pool;
