const mysql_queries = require('../../../db/queries').mysql;
const database_errors = require("../../../routes/errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../../db/mysql_connection').execute_query;
const to = require("../../../utils/utils").to;
const append_error_and_call_next = require("../../../utils/utils").append_error_and_call_next;

module.exports.get_single_question = async (req, res, next) => {
  const [get_question_query, get_choices_query] = await this.get_query_by_question_type(req.query.question_type);
  const [get_question_error, get_question_result] = await to(execute_query(get_question_query));
  if (get_question_error) {
    append_error_and_call_next(res, database_errors.CODE_100001, next);
    return;
  }

  res.data = await(get_question_result[0] || {});

  if (get_choices_query !== '') {
    const [get_choices_error, get_choices_result] = await to(execute_query(get_choices_query.replace('{question_id}', res.data.question_id)));
    if (get_choices_error) {
      append_error_and_call_next(res, database_errors.CODE_100003, next);
      return;
    }
    res.data.choices = get_choices_result;
  }

  // TODO: Store last question id in Redis
  // TODO: Add last question id to user's question ids in Redis
  next();
};

this.get_query_by_question_type = async (question_type) => {
  const QUESTION_TYPES = require('../../../model/question_types');
  if (!question_type) {
    const enum_element_count = require("../../../utils/utils").enum_element_count;
    question_type = Math.floor((Math.random() * enum_element_count(QUESTION_TYPES) + 1));
  }
  question_type = parseInt(question_type) || 0;
  let get_question_id_query;
  let get_choice_query = '';
  switch (question_type) {
    case QUESTION_TYPES.SIMPLE:
      get_question_id_query = mysql_queries.questions.get_random_simple_question;
      break;
    case QUESTION_TYPES.MULTI_CHOICE:
      get_question_id_query = mysql_queries.questions.get_random_multi_choice_question;
      get_choice_query = mysql_queries.answers.get_choice_text_by_question_id;
      break;
  }
  return [get_question_id_query, get_choice_query];
};