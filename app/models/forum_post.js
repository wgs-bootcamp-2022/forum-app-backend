/** @format */

module.exports = (sequelize, Sequelize) => {
  const SubForum = sequelize.define("forum_posts", {
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    picture: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.STRING,
    },
    like: {
      type: Sequelize.BOOLEAN,
    },
  });

  return SubForum;
};
