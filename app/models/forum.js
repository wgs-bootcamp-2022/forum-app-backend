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
      },
      type:{
        type: Sequelize.STRING
      },
      category:{
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }
    });
  
    return Forum;
  };