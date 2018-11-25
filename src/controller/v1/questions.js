const database_errors = require("../../routes/errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../db/mysql_connection').execute_query;
const to = require("../../utils/utils").to;
const append_error_and_call_next = require("../../utils/utils").append_error_and_call_next;
const question_repository = require('../../repository/v1/index').questions;

module.exports.get_single_question = async (req, res, next) => {
  const [get_question_error, get_choices_error, get_question_result, get_choices_result] =
    await question_repository.get_questions_choices(req.query.question_type, req.headers.user_id);

  if (get_question_error !== null || get_choices_error !== null) {
    append_error_and_call_next(res, get_question_error || get_choices_error, next);
    return;
  }

  res.data = await(get_question_result[0] || {});

  if (get_choices_result && get_choices_result !== '') {
    res.data.choices = get_choices_result;
  }

  // TODO: Store last question id in Redis
  // TODO: Add last question id to user's question ids in Redis
  next();
};

module.exports.get_all_questions_answers = async (req, res, next) => {
  // Retrieve all questions and answers by user_id
  const [err, questions_answers] = await question_repository.retrieve_all_QA_by_user_id(req.headers.user_id);
  if (err) {
    append_error_and_call_next(err, next);
    return;
  }
  res.data = questions_answers;
  next();
};