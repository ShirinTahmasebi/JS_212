const to = require("../../utils/utils").to;
const database_errors = require("../../routes/errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../db/mysql_connection').execute_query;

module.exports.retrieve_all_QA_by_user_id = async (user_id) => {
  const answer_model = require('../../model/mongo_models/answers').answer_schema;
  const [error, mongoos_res] = await to(answer_model.find({user_id}, {'answer_choices._id': 0, _id: 0, __v: 0}).exec());
  if (error) {
    return [database_errors.CODE_100003, null];
  }
  return [null, mongoos_res];
};

module.exports.get_questions_choices = async (question_type) => {
  const [get_question_query, get_choices_query] = await this.get_query_by_question_type(question_type);
  const [get_question_error, get_question_result] = await to(execute_query(get_question_query));

  if (get_choices_query === '') {
    return [get_question_error ? database_errors.CODE_100001 : null, null, get_question_result, null];
  } else {
    const data = await(get_question_result[0] || {});
    const [get_choices_error, get_choices_result] = await to(execute_query(get_choices_query.replace('{question_id}', data.question_id)));
    return [
      get_question_error ? database_errors.CODE_100001 : null,
      get_choices_error ? database_errors.CODE_100003 : null,
      get_question_result,
      get_choices_result,
    ];
  }
};

this.get_query_by_question_type = async (question_type) => {
  const mysql_queries = require('../../db/queries').mysql;
  const QUESTION_TYPES = require('../../model/question_types');
  if (!question_type) {
    const enum_element_count = require("../../utils/utils").enum_element_count;
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