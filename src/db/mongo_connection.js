module.exports.create_connection = () => {
  let mongoose = require('mongoose');

  let url = "mongodb://localhost:27017/js_212";

  mongoose.connect(url, {useNewUrlParser: true});

  let db = mongoose.connection;

  db.on('error', (err) => {
    console.log(err);
  });
};