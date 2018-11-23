module.exports = () => {
  require('./mysql_connection').create_connection();
  require('./mongo_connection').create_connection();
};