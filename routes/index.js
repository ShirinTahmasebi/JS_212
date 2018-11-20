const ERRORS = require("./error_codes").ERRORS;
const version = 'v1';
const baseURL = `/api/${version}`;
const questionsNameSpace = "questions";

module.exports = (app) => {

  app.all('*', function (req, res, next) {
    const doAuth = require("../services").doAuthentication(req.body.user_id);
    if (doAuth) {
      next();
    } else {
      res.json({
        'error': ERRORS.CODE_401,
      });
    }
  });

  app.use(`${baseURL}/`, require(`./${version}/index`));

  app.use(`${baseURL}/${questionsNameSpace}`, require(`./${version}/${questionsNameSpace}`));

  app.all('*', function (req, res, next) {
    let data = {};
    let error = {};
    if (res.error_code || res.error_message) {
      error = {'code': res.error_code, 'message': res.error_message};
    } else if (res.data) {
      data = res.data;
    } else {
      error = ERRORS.CODE_404;
    }
    res.json({
      'error': error,
      'data': data,
    });
  });
};
