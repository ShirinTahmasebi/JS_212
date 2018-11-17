var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get("/getQuestionsCount", (req, res, next) => {
  mysql_connection = require('../../bootstrap/mysql_connection');
  mysql_connection.query('SELECT count(*) as questions_count FROM questions', function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;