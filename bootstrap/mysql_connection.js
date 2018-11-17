const mysql = require('mysql');

const mysql_connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '12345678',
  database: 'JS_212',
});

mysql_connection.connect();

module.exports = mysql_connection;