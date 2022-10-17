module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }, 
      address: {
        type: Sequelize.STRING
      },
      defaultPicture: {
        type: Sequelize.STRING
      },
      phone:{
        type: Sequelize.STRING
      }
    });
  
    return User;
  };