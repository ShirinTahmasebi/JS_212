const to = require("../../utils/utils").to;
const database_errors = require("../../routes/errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../db/mysql_connection').execute_query;

module.exports.save_answer_simple_to_mongodb = async (question_id, user_id, answer_text, question_type) => {
  const answer_model = require('../../model/mongo_models/answers').answer_schema;
  let answer = await new answer_model();
  answer.question_id = question_id;
  answer.user_id = user_id;
  answer.answer_text = answer_text;
  answer.question_type = question_type;
  const [error, mongoos_res] = await to(answer.save());
  return [error, mongoos_res];
};

module.exports.save_answer_multi_choice_to_mongodb = async (question_id, user_id, answer_choices_ids, question_type) => {
  const answer_model = require('../../model/mongo_models/answers').answer_schema;
  const choice_model = require('../../model/mongo_models/answers').choice_schema;

  const choices = [];

  for (const choice_id of answer_choices_ids) {
    const [error, choice_result] = await this.get_choice_by_id(choice_id);

    if (error || choice_result[0] === undefined) {
      return [error, null];
    }

    const choice = new choice_model();
    choice.choice_id = choice_result[0].choice_id;
    choice.choice_type = choice_result[0].choice_type;
    choice.choice = choice_result[0].choice;
    choices.push(choice);
  }

  let answer = await new answer_model();
  answer.question_id = question_id;
  answer.user_id = user_id;
  answer.question_type = question_type;
  answer.answer_choices = choices;

  const [error, mongoos_res] = await to(answer.save());
  return [error, mongoos_res];
};

this.get_choice_by_id = async (choice_id) => {
  const mysql_queries = require('../../db/queries').mysql;
  const query = mysql_queries.answers.get_choice_by_id.replace('{choice_id}', choice_id);

  const [get_choice_error, get_choice_result] = await to(execute_query(query));
  if (get_choice_error) {
    return [database_errors.CODE_100003, null];
  } else {
    return [null, get_choice_result];
  }
};