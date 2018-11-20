module.exports.append_database_error_to_response = (response, error) => {
  const database_errors = require("../errors/error_codes").ERRORS.database_errors;
  response.error_code = database_errors.CODE_100001.code;
  response.error_message = database_errors.CODE_100001.message;
  const database_error_log = require('../../db/mysql_connection').error_log;
  database_error_log(error);
};

module.exports.append_custom_error_to_response = (response, error) => {
  response.error_code = error.code;
  response.error_message = error.message;
};