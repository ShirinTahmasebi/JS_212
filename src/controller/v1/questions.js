const database_errors = require("../../routes/errors/error_codes").ERRORS.database_errors;
const logic_errors = require("../../routes/errors/error_codes").ERRORS.logic_errors;
const execute_query = require('../../db/mysql_connection').execute_query;
const to = require("../../utils/utils").to;
const append_error_and_call_next = require("../../utils/utils").append_error_and_call_next;
const question_repository = require('../../repository/index').questions;

module.exports.get_single_question = async (req, res, next) => {
  const [error, user_previous_questions] = await this.get_and_format_user_previous_questions(req.headers.user_id);
  if (error) {
    append_error_and_call_next(res, error, next);
    return;
  }
  const [get_question_error, get_choices_error, get_question_result, get_choices_result] =
    await question_repository.get_question_with_choices(req.query.question_type, user_previous_questions);

  if (get_question_error !== null || get_choices_error !== null) {
    append_error_and_call_next(res, get_question_error || get_choices_error, next);
    return;
  } else if (get_question_error === null && get_choices_error === null && get_question_result.length === 0) {
    append_error_and_call_next(res, logic_errors.CODE_200003, next);
    return;
  }

  res.data = await(get_question_result[0] || {});

  if (get_choices_result && get_choices_result !== '') {
    res.data.choices = get_choices_result;
  }
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

this.get_and_format_user_previous_questions = async (user_id) => {
  const [error, mongoose_result] = await question_repository.get_user_previous_questions(user_id);
  if (error) {
    return [error, null];
  }
  const question_ids_set = new Set();
  for (const item of mongoose_result) {
    question_ids_set.add(item.question_id);
  }
  return [null, Array.from(question_ids_set).toString()];
};