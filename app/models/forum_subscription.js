/** @format */

module.exports = (sequelize, Sequelize) => {
  const ForumSub = sequelize.define("forum_subscriptions", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    forumId: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isRequest:{
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }
  });

  return ForumSub;
};
