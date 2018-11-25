const to = require("../../utils/utils").to;
const append_error_and_call_next = require("../../utils/utils").append_error_and_call_next;
const mysql_queries = require('../../db/queries').mysql;
const errors = require("../../routes/errors/error_codes").ERRORS;
const execute_query = require('../../db/mysql_connection').execute_query;
const question_types = require('../../model/question_types');
const answer_repository = require('../../repository/v1/index').answers;

module.exports.post = async (request, response, next) => {
  // Retrieve important data from body
  const question_id = request.params.question_id;
  const answer_text = request.body.answer_text;
  const answer_choices_ids = request.body.answer_choices_ids;

  const [error, question_types_result] = await to(execute_query(mysql_queries.questions.get_question_type_by_question_id.replace('{question_id}', question_id)));
  if (error) {
    append_error_and_call_next(response, error, next);
    return;
  }

  let validate_answer_error;
  let validate_answer_response;
  const question_type = parseInt(question_types_result[0].question_type) || 0;

  // Get question type to check if the answer is valid or not
  if (question_type === question_types.SIMPLE && answer_text) {
    [validate_answer_error, validate_answer_response] = await this.validate_answer_to_simple_question(request, response);
  } else if (question_type === question_types.MULTI_CHOICE && answer_choices_ids) {
    [validate_answer_error, validate_answer_response] = await this.validate_answer_to_multichoice_question(request, response);
  } else {
    // Probably question id is not valid
    validate_answer_error = errors.logic_errors.CODE_200001;
  }

  // Check results - If validate_answer_error return it else go to next middleware
  if (validate_answer_error) {
    append_error_and_call_next(response, validate_answer_error, next);
    return;
  }
  response.data = validate_answer_response;
  next();

};

this.validate_answer_to_multichoice_question = async (request, response) => {
  const question_id = request.params.question_id;
  const answer_choices_ids = request.body.answer_choices_ids;
  const user_id = request.headers.user_id;

  const [err, result] = await to(execute_query(mysql_queries.answers.get_choice_ids_by_question_id.replace('{question_id}', question_id)));
  if (err) return [err, null];

  const question_choices_ids = [];
  for (const item of result) {
    question_choices_ids.push(item.choice_id);
  }

  let are_choices_valid = true;
  for (const choice of answer_choices_ids) {
    are_choices_valid = are_choices_valid && question_choices_ids.includes(choice);
  }

  if (are_choices_valid) {
    // Store answer in MongoDB
    const [err, res] =
      await answer_repository.save_answer_multi_choice_to_mongodb(
        question_id,
        user_id,
        answer_choices_ids,
        question_types.MULTI_CHOICE,
      );
    if (err) return [err, null];
    return [null, {question_id, answer_choices_ids, 'question_type': question_types.MULTI_CHOICE}];
  } else {
    return [errors.logic_errors.CODE_200002, null];
  }
};

this.validate_answer_to_simple_question = async (request, response) => {
  const question_id = request.params.question_id;
  const answer_text = request.body.answer_text;
  const user_id = request.headers.user_id;

  // Store answer in MongoDB
  const [err, res] = await answer_repository.save_answer_simple_to_mongodb(question_id, user_id, answer_text, question_types.SIMPLE);
  if (err) return [err, null];
  return [null, {question_type: question_types.SIMPLE, question_id, answer_text}];
};
