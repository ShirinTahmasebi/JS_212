const express = require('express');
const router = express.Router();

router.post('/', function (req, res, next) {
  res.data = {"hi": "bye"};
  next();
});

module.exports = router;