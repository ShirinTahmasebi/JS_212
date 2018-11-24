module.exports.save_answer_to_mongodb = async (question_id, user_id, answer_text, question_type) => {
  const to = require("../../../utils/utils").to;
  const answer_model = require('../../../model/mongo_models/answers');
  let answer = await new answer_model();
  answer.question_id = question_id;
  answer.user_id = user_id;
  answer.answer = answer_text;
  answer.question_type = question_type;
  const [error, mongoos_res] = await to(answer.save());
  return [error, mongoos_res];
};