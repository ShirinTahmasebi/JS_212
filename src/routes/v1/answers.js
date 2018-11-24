const answer_controller = require('../../controller/v1/index').answers;
const express = require('express');
const router = express.Router();

router.get('/answer', function (req, res, next) {
  res.json({felan: "BISAR"});
});

router.post("/:question_id/answer", (request, response, next) => answer_controller.post(request, response, next));

module.exports = router;