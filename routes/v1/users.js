const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/getQuestion", (req, res, next) => {
  execute_query = require('../../bootstrap/mysql_connection').execute_query;
  return execute_query('SELECT * FROM questions',
    (results, fields) => {
      const selected_question_index = Math.floor((Math.random() * results.length));
      return res.json(results[selected_question_index]);
    },
    (error) => {
      return error;
    },
  );
});

onFailure =
  module.exports = router;