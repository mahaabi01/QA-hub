module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define("Question", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Questions;
};
