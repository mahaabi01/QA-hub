const { questions } = require("../model");
const { questions, users, answers, sequelize } = require("../model");
const { cloudinary } = require("../cloudinary/index");

exports.renderAskQuestionPage = (req, res) => {
  res.render("questions/askQuestion");
};

exports.askQuestion = async (req, res) => {
  const { title, description } = req.body;

  const userId = req.userId;
  const fileName = req.file.filename;
  const result = cloudinary.v2.uploader.upload(req.file.path);
  if (!title || !description) {
    return res.send("Please provide title, description");
  }
  await questions.create({
    title,
    description,
    image: fileName,
    userId,
  });
  res.redirect("/");
};

exports.getAllQuestion = async (req, res) => {
  const data = await questions.findAll({});
  //the following code joins the table
  include: [
    {
      model: users,
    },
  ];
};
