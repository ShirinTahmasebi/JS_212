const express = require('express');
const mysql_queries = require('../../../db/queries').mysql.questions;
const database_errors = require("../../errors/error_codes").ERRORS.database_errors;
const execute_query = require('../../../db/mysql_connection').execute_query;
const router = express.Router();

this.getQueryBasedOnQuestionType = (question_type) => {
  question_type = parseInt(question_type) || 0;
  let query;
  switch (question_type) {
    case 1:
      query = mysql_queries.get_random_simple_question;
      break;
    case 2:
      query = mysql_queries.get_random_multi_choice_question;
      break;
    default:
      query = mysql_queries.get_random_question;
      break;
  }
  return query;
};

router.get('/', function (req, res, next) {
  res.json({ping: "PONG"});
});

router.get("/single", (req, res, next) => {
  execute_query(this.getQueryByQuestionType(req.query.question_type))
    .then((result) => {
      res.data = result[0] || {};
      // TODO: Store last question id in Redis
      // TODO: Add last question id to user's question ids in Redis
    })
    .catch((error) => {
      // TODO: Log error
      res.error_code = database_errors.CODE_100001.code;
      res.error_message = database_errors.CODE_100001.message;
    })
    .finally(() => next());
});

module.exports = router;