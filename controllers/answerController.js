const { QueryTypes } = require("sequelize");
const db = require("../model");
const { answers, sequelize } = require("../model");

exports.handleAnswer = async (req, res) => {
  const userId = req.userId;
  const { answer } = req.body;
  const { id: questionId } = req.body;
  await answer.create({
    answerText: answer,
    userId,
    questionId,
  });

  await sequelize.query(`CREATE TABLE likes_${data.id} (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE)`,
  type: QueryTypes.CREATE)
  
  res.redirect(`/question/${questionId}`);
};
