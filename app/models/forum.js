module.exports = (sequelize, Sequelize) => {
    const Forum = sequelize.define("forums", {
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
      }
    });
  
    return Forum;
  };