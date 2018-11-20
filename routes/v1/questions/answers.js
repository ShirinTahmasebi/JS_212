const append_database_error_to_response = require("../../errors/error_utils");
const express = require('express');
const mysql_queries = require('../../../db/queries').mysql;
const errors = require("../../errors/error_codes").ERRORS;
const execute_query = require('../../../db/mysql_connection').execute_query;
const router = express.Router();

router.get('/answer', function (req, res, next) {
  res.json({felan: "BISAR"});
});

router.post("/:question_id/answer", (requset, response, next) => {
  // Retrieve important data from body
  const question_id = requset.params.question_id;
  const answer_text = requset.body.answer_text;
  const answer_choices_ids = requset.body.answer_choices_ids;

  // Get question type to check if the answer is valid or not
  execute_query(mysql_queries.questions.get_question_type_by_question_id.replace('{question_id}', question_id))
    .then((question_types_result) => {
      const question_type = parseInt(question_types_result[0].question_type) || 0;

      if (question_type === 1 && answer_text) {
        // TODO: Store answer in MongoDB
        // TODO: Store answered question id in Redis
      } else if (question_type === 2 && answer_choices_ids) {
        execute_query(mysql_queries.answers.get_answer_choice_ids_by_question_id.replace('{question_id}', question_id))
          .then(result => {
            const question_choices_ids = [];
            for (const item of result) {
              question_choices_ids.push(item.choice_id);
            }

            let are_choices_valid = true;
            for (const choice of answer_choices_ids) {
              are_choices_valid && question_choices_ids.includes(choice);
            }
            if (are_choices_valid) {
              // TODO: Store answer in MongoDB
              // TODO: Store answered question id in Redis
            }
          })
          .catch(error => append_database_error_to_response(response, error));
      } else {
        // Probably question id is not valid
        response.error_code = errors.logic_errors.CODE_200001.code;
        response.error_message = errors.logic_errors.CODE_200001.message;
      }
    })
    .catch(error => append_database_error_to_response(response, error))
    .finally(() => next());
});

module.exports = router;