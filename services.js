module.exports.doAuthentication = (user_id) => {
  if (user_id) {
    // TODO: Do authentication
  } else {
    return (new Error(401));
  }
};

const createError = require('http-errors');

module.exports.errors = (app) => {
  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({'error': err.message});
  });
};