const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

// la sequelize yo config haru lag ani database connect gardey vaneko hae
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3306,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// updating entries here - we have created user model so we have to update it here
db.users = require("./userModel.js")(sequelize, DataTypes);
db.blogs = require("./blogModel.js")(sequelize, DataTypes);
db.answers = require("./answerModel.js")(sequelize, DataTypes);
db.questions = require("./questionModel.js")(sequelize, DataTypes);

db.users.hasMany(db.questions);
db.questions.belongsTo(db.users);

db.questions.hasMany(db.answers);
db.answers.belongsTo(db.questions);

db.users.hasMany(db.answers);
db.answers.belongsTo(db.users);

// this code ensures that your database is synchronized with the models defined in your Sequelize application.
db.sequelize.sync({ force: true }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;
