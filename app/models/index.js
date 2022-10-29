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

db.user = require("./user.js")(sequelize, Sequelize);
db.role = require("./role.js")(sequelize, Sequelize);
db.user_role = require("./user_role.js")(sequelize, Sequelize);
db.forum = require("./forum.js")(sequelize, Sequelize);
db.sub_forum = require("./sub_forum.js")(sequelize, Sequelize);
db.forum_subscription = require("./forum_subscription.js")(sequelize, Sequelize);
db.discussion = require("./forum_post.js")(sequelize, Sequelize);
db.image_profile = require("./image_profile.js")(sequelize, Sequelize);
db.image_forum = require("./image_forum.js")(sequelize, Sequelize);
db.image_subforum = require("./image_subforum.js")(sequelize, Sequelize);

db.log = require("./log.js")(sequelize, Sequelize);




// user dan role many to many, user bisa mempunyai banyak role dan setiap role punya banyak user
db.role.belongsToMany(db.user, {
  as: "role",
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
db.image_profile.belongsTo(db.user,  {
  as:"image_profile",
  foreignKey:"userId"
})

//forum dan image forum one to one

db.forum.hasOne(db.image_forum)
db.image_forum.belongsTo(db.forum, {
  as:"image_forum",
  foreignKey:"forumId"
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
db.sub_forum.hasMany(db.discussion)
db.discussion.belongsTo(db.sub_forum,{
  foreignKey:"subForumId"
})

db.sub_forum.hasOne(db.image_subforum)
db.image_subforum.belongsTo(db.sub_forum, {
  as:"image_subforum",
  foreignKey:"subForumId"
})
db.ROLES = ["user", "admin", "superadmin"];

module.exports = db;