const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  choice_id: {type: String},
  choice_type: {type: Number},
  choice: {type: String},
});

const AnswerSchema = new mongoose.Schema({
  question_id: {type: String, required: true},
  user_id: {type: String, required: true},
  answer_text: {type: String},
  answer_choices: [ChoiceSchema],
  question_type: {type: Number, required: true},
});

module.exports.answer_schema = mongoose.model('Answer', AnswerSchema);
module.exports.choice_schema = mongoose.model('Choice', ChoiceSchema);