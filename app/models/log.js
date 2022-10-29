module.exports = (sequelize, Sequelize) => {
    const ImageProfile = sequelize.define("logs", {
      username: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },

      client_ip: {
        type: Sequelize.STRING,
      },
      request_method: {
        type: Sequelize.STRING,
      },
      endpoint: {
        type: Sequelize.STRING,
      },
      status_code: {
        type: Sequelize.STRING,
      },
      content_length: {
        type: Sequelize.STRING,
      },
      response_time: {
        type: Sequelize.STRING,
      }
    });
  
    return ImageProfile;
  };