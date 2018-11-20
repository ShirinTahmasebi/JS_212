const express = require('express');
const mysql_queries = require('../../db/queries').mysql.questions;
const database_errors = require("../error_codes").ERRORS.database_errors;
const execute_query = require('../../db/mysql_connection').execute_query;
const router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ping: "PONG"});
});

router.post("/getQuestion", (req, res, next) => {
  execute_query(mysql_queries.get_random_question).then((result) => {
    res.data = result[0] || {};
  }).catch((error) => {
    // TODO: Log error
    res.error_code = database_errors.CODE_100001.code;
    res.error_message = database_errors.CODE_100001.message;
  }).finally(() => next());
});

module.exports = router;