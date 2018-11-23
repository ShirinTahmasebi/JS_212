const mysql_queries = require('../../../db/queries').mysql.questions;
const database_errors = require("../../../routes/errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../../db/mysql_connection').execute_query;
const to = require("../../../utils/to").to;
const append_error_and_call_next = require("../../../utils/to").append_error_and_call_next;

module.exports.get_single_question = async (req, res, next) => {
  const query = await this.getQueryByQuestionType(req.query.question_type);
  const [error, result] = await to(execute_query(query));
  if (error) {
    append_error_and_call_next(res, database_errors.CODE_100001, next);
    return;
  }
  res.data = await(result[0] || {});
  // TODO: Store last question id in Redis
  // TODO: Add last question id to user's question ids in Redis
  next();
};

this.getQueryByQuestionType = async (question_type) => {
  if (!question_type) return mysql_queries.get_random_question;
  question_type = parseInt(question_type) || 0;
  let query;
  switch (question_type) {
    case 1:
      query = mysql_queries.get_random_simple_question;
      break;
    case 2:
      query = mysql_queries.get_random_multi_choice_question;
      break;
  }
  return query;
};