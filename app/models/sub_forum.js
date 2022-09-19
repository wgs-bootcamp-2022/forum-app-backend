module.exports = (sequelize, Sequelize) => {
    const SubForum = sequelize.define("sub_forums", {
      title: {
        type: Sequelize.STRING
      },
      description: {
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