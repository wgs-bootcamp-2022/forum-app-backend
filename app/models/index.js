const config = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
db.user_role = require("../models/user_role.js")(sequelize, Sequelize);
db.forum = require("../models/forum.js")(sequelize, Sequelize);
db.sub_forum = require("../models/sub_forum.js")(sequelize, Sequelize);
db.forum_subscription = require("../models/forum_subscription.js")(sequelize, Sequelize);
db.forum_post = require("../models/forum_post.js")(sequelize, Sequelize);
db.image_profile = require("../models/image_profile.js")(sequelize, Sequelize);


// user dan role many to many, user bisa mempunyai banyak role dan setiap role punya banyak user
db.role.belongsToMany(db.user, {
  through: db.user_role,
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: db.user_role,
  foreignKey: "userId",
  otherKey: "roleId"
});

//user dan image profile one to one
db.user.hasOne(db.image_profile)
db.image_profile.belongsTo(db.user, {
  foreignKey:"userId"
})

// user_role many to many dengan forum, user bisa membuat banyak forum dan forum bisa diakses oleh banyak user
db.user.belongsToMany(db.forum, {
  through: db.forum_subscription,
  foreignKey:"userId",
  otherKey:"forumId"
})

db.forum.belongsToMany(db.user, {
  through: db.forum_subscription,
  foreignKey:"forumId",
  otherKey:"userId"
})

// setiap forum mempunyai banyak sub forum
db.forum.hasMany(db.sub_forum)
db.sub_forum.belongsTo(db.forum,{
  foreignKey:"forumId"
})

// setiap sub forum mempunyai banyak discussion
db.sub_forum.hasMany(db.forum_post)
db.forum_post.belongsTo(db.sub_forum,{
  foreignKey:"subForumId"
})

db.ROLES = ["user", "admin", "superadmin"];

module.exports = db;