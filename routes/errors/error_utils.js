module.exports.append_database_error_to_response = (response, error) => {
  response.error_code = errors.database_errors.CODE_100001.code;
  response.error_message = errors.database_errors.CODE_100001.message;
  const database_error_log = require('../../db/mysql_connection').error_log;
  database_error_log(error);
};