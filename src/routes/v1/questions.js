const express = require('express');
const router = express.Router();
const question_controller = require('../../controller/v1/index').questions;

router.get('/', (req, res, next) => question_controller.get_all_questions_answers(req, res, next));

router.get("/single", (req, res, next) => question_controller.get_single_question(req, res, next));

module.exports = router;