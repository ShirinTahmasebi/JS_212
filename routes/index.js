const version = 'v1';
const baseURL = `/api/${version}`;
const questionsNameSpace = "questions";

module.exports = (app) => {
  app.all('*', function (req, res, next) {
    const doAuthentication = require("../services").doAuthentication;
    next(doAuthentication(req.body.user_id));
  });
  app.use(`${baseURL}/`, require(`./${version}/index`));
  app.use(`${baseURL}/${questionsNameSpace}`, require(`./${version}/${questionsNameSpace}`));
};
