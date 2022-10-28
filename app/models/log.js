module.exports = (sequelize, Sequelize) => {
    const ImageProfile = sequelize.define("logs", {
      date: {
        type: Sequelize.STRING
      },
      method:{
        type: Sequelize.STRING
      },
      url :{
        type: Sequelize.STRING
      },
    //   http_version :{
    //     type: Sequelize.STRING
    //   },
    //   status :{
    //     type: Sequelize.STRING
    //   },
    //   length :{
    //     type: Sequelize.STRING
    //   },
    //   response_time :{
    //     type: Sequelize.STRING
    //   },
    //   user_agent :{
    //     type: Sequelize.STRING
    //   },
    //   session_id :{
    //     type: Sequelize.STRING
    //   },
    //   hostname :{
    //     type: Sequelize.STRING
    //   },
    //   instance :{
    //     type: Sequelize.STRING
    //   },
    //   pid :{
    //     type: Sequelize.STRING
    //   },
    });
  
    return ImageProfile;
  };