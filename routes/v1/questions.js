const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ping: "PONG"});
});

router.post("/getQuestion", (req, res, next) => {
  execute_query = require('../../bootstrap/mysql_connection').execute_query;
  execute_query('SELECT * FROM questions',
    (results, fields) => {
      const selected_question_index = Math.floor((Math.random() * results.length));
      res.data = results[selected_question_index];
    },
    (error_code, error_message) => {
      res.error_code = error_code;
      res.error_message = error_message;
    },
    next,
  );
});

onFailure = module.exports = router;