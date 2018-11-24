module.exports.ERRORS = {
  web_service_errors: {
    CODE_401: {code: 401, message: 'USER_AUTHENTICATION_PROBLEM'},
    CODE_404: {code: 404, message: 'PAGE_NOT_FOUND'},
  },
  database_errors: {
    CODE_100001: {code: 100001, message: 'RETRIEVE_QUESTIONS_PROBLEM'},
    CODE_100002: {code: 100002, message: 'QUESTION_NOT_FOUND'},
    CODE_100003: {code: 100003, message: 'RETRIEVE_CHOICES_PROBLEM'},
  },
  logic_errors: {
    CODE_200001: {code: 200001, message: 'QUESTION_ANSWER_TYPE_MISMATCH'},
    CODE_200002: {code: 200002, message: 'INVALID_CHOICE_IDS'},
  },
}
;