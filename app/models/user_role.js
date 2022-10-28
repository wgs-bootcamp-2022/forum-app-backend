/** @format */

module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define("user_roles", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });
  return UserRole;
};
