const version = 'v1';
const baseURL = `/api/${version}`;

module.exports = (app) => {
  app.use(`${baseURL}/`, require(`./${version}/index`));
  app.use(`${baseURL}/users`, require(`./${version}/users`));
};
