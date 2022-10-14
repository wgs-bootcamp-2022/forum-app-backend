module.exports = (sequelize, Sequelize) => {
  const SubForum = sequelize.define("forum_discussions", {
    title: {
      type: Sequelize.STRING
    },
    descripton: {
      type: Sequelize.STRING
    },
    picture: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    },
    message: {
      type: Sequelize.STRING
    },
  });

  return SubForum;
};