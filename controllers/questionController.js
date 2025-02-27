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

exports.renderSingleQuestionPage = async (req, res) => {
  const { id } = req.params;
  const data = await questions.findAll({
    where: {
      id: id,
    },
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });
  let likes;
  let count = 0;
  try {
    likes = await sequelize.query(`SELECT * FROM likes_${id}`, {
      type: QueryType.SELECT,
    });
    if (likes.length) {
      count = likes.length;
    }
  } catch (error) {
    console.log(error);
  }

  const answerData = await answers.findAll({
    where: {
      questionId: id,
    },
    include: [
      {
        model: users,
        attributes: ["username"],
      },
    ],
  });
  res.render("./questions/singleQuestion", {
    data,
    answers: answersData,
    likes: count,
  });
};
