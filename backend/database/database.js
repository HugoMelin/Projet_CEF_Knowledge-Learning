const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

module.exports = pool;
