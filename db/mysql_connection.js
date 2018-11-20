const mysql = require('mysql');

const mysql_connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '12345678',
  database: 'JS_212',
});

mysql_connection.connect();

module.exports.execute_query = (query_text, query_variables) => {
  return new Promise((resolve, reject) => {
    mysql_connection.query(query_text, query_variables, function (error, results, fields) {
      if (error) {
        return reject(error);
      }
      resolve(results, fields);
    });
  });
};