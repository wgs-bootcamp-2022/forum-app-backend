module.exports = (sequelize, Sequelize) => {
    const ImageProfile = sequelize.define("image_profiles", {
      filename: {
        type: Sequelize.STRING
      },
      filepath:{
        type: Sequelize.STRING
      },
      mimetype :{
        type: Sequelize.STRING
      },
      size :{
        type: Sequelize.INTEGER
      },
      userId:{
        type: Sequelize.INTEGER
      }
    });
  
    return ImageProfile;
  };