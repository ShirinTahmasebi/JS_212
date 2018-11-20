const question_types = require('../model/question_types');
const queries = {
  mysql: {
    questions: {
      get_all: 'SELECT * FROM questions',
      get_random_question: 'SELECT * FROM questions ORDER BY RAND() LIMIT 1',
      get_random_simple_question: `SELECT * FROM questions WHERE question_type=${question_types.SIMPLE} ORDER BY RAND() LIMIT 1`,
      get_random_multi_choice_question: `SELECT * FROM questions WHERE question_type=${question_types.MULTI_CHOICE} ORDER BY RAND() LIMIT 1`,
    },
    users: {},
  },
};

module.exports = queries;