const queries = {
  mysql: {
    questions: {
      get_all: 'SELECT * FROM questions',
      get_random_question: 'SELECT * FROM questions ORDER BY RAND() LIMIT 1',
    },
    users: {},
  },
};

module.exports = queries;