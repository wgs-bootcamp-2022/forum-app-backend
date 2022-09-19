module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "hajimaru",
    DB: "db_forum",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };