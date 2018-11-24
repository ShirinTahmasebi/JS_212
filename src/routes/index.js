const webservices_errors = require("./errors/error_codes").ERRORS.web_service_errors;
const version = 'v1';
const baseURL = `/api/${version}`;
const questionsDirectory = "questions";
const answersDirectory = "answers";
const questionsNameSpace = "questions";

module.exports = (app) => {

  app.all('*', function (req, res, next) {
    const doAuth = require("../utils/services").doAuthentication(req.headers.user_id);
    if (doAuth) {
      next();
    } else {
      res.json({
        'error': webservices_errors.CODE_401,
      });
    }
  });

  app.use(`${baseURL}/`, require(`./${version}/index`));

  app.use(`${baseURL}/${questionsNameSpace}`, require(`./${version}/${questionsDirectory}`));

  app.use(`${baseURL}/${questionsNameSpace}`, require(`./${version}/${answersDirectory}`));

  app.all('*', function (req, res, next) {
    let data = {};
    let error = {};
    if (res.error_code || res.error_message) {
      error = {'code': res.error_code, 'message': res.error_message};
    } else if (res.data) {
      data = res.data;
    } else {
      error = webservices_errors.CODE_404;
    }
    res.json({
      'error': error,
      'data': data,
    });
  });
};
