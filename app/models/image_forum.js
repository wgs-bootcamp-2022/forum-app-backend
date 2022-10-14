module.exports = (sequelize, Sequelize) => {
  const ImageForum = sequelize.define("image_forums", {
    filename: {
      type: Sequelize.STRING
    },
    filepath: {
      type: Sequelize.STRING
    },
    mimetype: {
      type: Sequelize.STRING
    },
    size: {
      type: Sequelize.INTEGER
    },
    forumId: {
      type: Sequelize.INTEGER
    }
  });

  return ImageForum;
};