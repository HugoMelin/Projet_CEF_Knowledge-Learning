import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

async function getAllusers() {
  const [result] = await pool.query('SELECT * FROM users');
  return result;
}

const users = await getAllusers();
console.log(users);
