const question_types = require('../model/question_types');
const queries = {
  mysql: {
    questions: {
      get_all: 'SELECT * FROM questions',
      get_random_question: 'SELECT * FROM questions ORDER BY RAND() LIMIT 1',
      get_random_simple_question: `SELECT * FROM questions WHERE question_type=${question_types.SIMPLE} ORDER BY RAND() LIMIT 1`,
      get_random_multi_choice_question: `SELECT * FROM questions WHERE question_type=${question_types.MULTI_CHOICE} ORDER BY RAND() LIMIT 1`,
      get_question_type_by_question_id: `SELECT question_type FROM questions WHERE question_id={question_id}`,
    },
    answers: {
      get_choice_ids_by_question_id: 'SELECT choice_id FROM questions_choices WHERE question_id={question_id}',
      get_choice_text_by_question_id: 'SELECT choices.choice_id, choices.choice_type, choices.choice FROM (questions INNER JOIN questions_choices ON questions.question_id = questions_choices.question_id) INNER JOIN choices ON choices.choice_id = questions_choices.choice_id WHERE questions.question_id = {question_id}',
    },
    users: {},
  },
};

module.exports = queries;