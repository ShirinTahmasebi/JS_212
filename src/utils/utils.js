// to.js [https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/]
module.exports.to = function to(promise) {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
};

module.exports.append_error_and_call_next = (response, error, next) => {
  const append_custom_error_to_response = require("../routes/errors/error_utils").append_custom_error_to_response;
  append_custom_error_to_response(response, error);
  next();
};

module.exports.enum_element_count = (enumName) => {
  let count = 0;
  for (let item in enumName) {
    if (isNaN(Number(item))) count++;
  }
  return count;
};