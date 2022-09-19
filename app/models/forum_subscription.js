module.exports = (sequelize, Sequelize) => {
    const ForumSub = sequelize.define("forum_subscriptions", {
      userId: {
        type: Sequelize.INTEGER
      },
      forumId: {
        type: Sequelize.INTEGER
      }
    });
  
    return ForumSub;
  };