/** @format */

const db = require("../models");
const Forum = db.forum;
const SubForum = db.sub_forum;
const ForumPost = db.forum_post;
const User = db.user;
const UserRole = db.user_role;
const ImageProfile = db.image_profile;
const ForumSubscription = db.forum_subscription;
const path = require("path");
const { image_profile, user_role } = require("../models");
const sequelize = db.sequelize;

//get image
exports.getImage = (req, res) => {
  const { filename } = req.params;
  ImageProfile.findAll({
    where: {
      filename: filename,
    },
  })
    .then((images) => {
      if (images[0]) {
        const dirname = path.resolve();
        const fullfilepath = path.join(dirname, images[0].filepath);
        return res.type(images[0].mimetype).sendFile(fullfilepath);
      }
      return Promise.reject(new Error("Image does not exist"));
    })
    .catch((err) =>
      res.status(404).json({
        success: false,
        message: "not found",
        stack: err.stack,
      })
    );
};
//create main forum
exports.createForum = (req, res) => {
  Forum.create({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
  })
    .then(user => {
      if (req.body.userId) {
        User.findAll({
          where: {
            id: req.body.userId,
          },
        }).then(userId => {
          user.setUsers(userId).then(() => {
            res.send({ message: "Forum was registered successfully!" });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// create sub forum
exports.createSubForum = (req, res) => {
  console.log("ini forum id", req.body.forumId)

  SubForum.create({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture,
    content: req.body.contett,
    message: req.body.message,
  })
  .then(forum => {
    console.log("ini forum id", req.body.forumId)
    if (req.body.forumId) {
      Forum.findAll({
        where: {
          id: req.body.forumId,
        },
      }).then(forumId => {
        forum.setForums(forumId).then(() => {
          res.send({ message: "Sub Forum was registered successfully!" });
        });
      });
    }
  })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//create comment di sub forum masing-masing
exports.createPostComment = (req, res) => {
  ForumPost.create({
    // id: req.body.id,
    message: req.body.message,
    content: req.body.content,
    subForumId: req.body.subForumId,
  })
    .then((user) => {
      res.send({ message: "Commnent was created!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
//update user menjadi admin
exports.updateUsertoAdmin = async (req, res) => {
  // const roleUpdate = req.body.roleId
  await UserRole.update(
    req.body,
    {
      where: {
        roleId: +req.params.roleId,
        userId: +req.params.userId,
      },
    }
  );
  res.json("Update User was succes");
};

//menghapus komentar user oleh admin
exports.deleteCommenByAdmin = async (req, res) => {
  await CommentSubForum.destroy({
    where: {
      id: +req.params.id,
    },
  });
  req.json("comment berhasil di delete");
};

//get all forum
exports.getAllForum = async (req, res) => {
  const forums = await Forum.findAll();
  res.json(forums);
};

// get all user 
exports.getaAllUser = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// get all data user relasi dengan imahe
exports.getaAllDataUser = (req, res) => {
  const id = +req.params.id;
  User.findAll({
    attributes: ["name", "username", "address","email","phone", "createdAt", "updatedAt"],
    include: [
      {
        model: ImageProfile,
        where: { userId: id },
        attributes: ["filename","filepath"],
      },
    ],
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.json(">> Error while finding Profile Data: ", err);
    });
};

//searching berdasarkan query params title
exports.findByTitle = async (req, res) => {
  // const title = req.query.title
  const forum = await Forum.findAll({
    where: {
      title : req.query.title
    }
  })
  res.json(forum)
} 
// // exports.getUserById = async (req, res) => {
//   const user = await User.findByPk(+req.params.id);
//   res.json(user);
// };

//get forum by id
exports.getForumById = async (req, res) => {
  const forum = await Forum.findByPk(+req.params.id);
  res.json(forum);
};

exports.getForumByTitle = async (req, res) => {
  const title = await Forum.findOne({ where: { title: req.params.title } });
  res.json(title);
};
//get all sub forum
exports.getSubForumAll = async (req, res) => {
  const subForums = await SubForum.findAll();
  res.send(subForums);
};

// get sub-forum berdasarkan forum
exports.getSubForumByForumId = async (req, res) => {
  const forumId = await Forum.findOne({ where: { id: +req.params.id } });
  const subForumsByForumId = await SubForum.findByPk(forumId.id);
  res.send(subForumsByForumId);
};

//get semua comment
exports.getAllComment = async (req, res) => {
  const comments = await CommentSubForum.findAll();
  res.send(comments);
};

// get semua comment berdasarkan id
exports.getCommentById = async (req, res) => {
  const comments = await CommentSubForum.findByPk(+req.params.id);
  res.send(comments);
};

// exports.joinCommentSubForum = async(req, res) => {
//   const [results, metadata] = await sequelize.query(
//     `SELECT a.id as forum_id ,a.title, a.descripton, a.picture, b.content, b.image, b."createdAt" as created FROM sub_forums a
//       INNER JOIN comment_sub_forums b ON a.id = b."subForumId"
//       ORDER BY a.id`
//   );
//   res.send(results)
// }

//get user-prifile
exports.getAllUserProfile = (req, res) => {
  const userId = req.params.userId;
  sequelize
    .query(
      `SELECT a.username, a.name, a.email, a.address, b.filename, b.filepath FROM users a
    JOIN image_profiles b ON a.id = b."userId"
    WHERE a.id = '${userId}'
    ORDER BY a.name;`
    )
    .then((usr) => {
      res.json(usr[0][0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

//get user-profile-main-forum
exports.getAllUserProfileForum = (req, res) => {
  const userId = req.params.userId;
  sequelize
    .query(
      `SELECT a.username, a.name, a.email, a.address, b.filename, b.filepath, d.title, d.description, d.picture,
        d.content, c."createdAt", c."updatedAt" FROM users a
        JOIN image_profiles b ON a.id = b."userId"
        JOIN forum_subscriptions c ON a.id = c."userId"
        JOIN forums d ON c."forumId" = d.id
        WHERE a.id = '${userId}'
        ORDER BY a.name;
      `
    )
    .then((usr) => {
      res.json(usr[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

//get user-profile-main-forum-sub-forum
// exports.getAllUserMainForumSubForum = (req, res) => {
//   const userId = +req.params.userId
//   sequelize.query(
//     `	SELECT a.username, a.name, a.email, a.address, b.filename, b.filepath, d.title, d.description, d.picture,
//     d.content, c."createdAt", c."updatedAt", e.title, e.description, e.picture, e.message, e."createdAt",
//     e."updatedAt" FROM users a
//       JOIN image_profiles b ON a.id = b."userId"
//     JOIN forum_subscriptions c ON a.id = c."userId"
//     JOIN forums d ON c."forumId" = d.id
//     JOIN sub_forums e ON d.id = e."forumId"
//       WHERE a.id = '${userId}'
//       ORDER BY a.name`
//   ) .then(usr => {
//     res.json(usr[0])

//   }) .catch(err => {
//     res.send(err)
//   })
// }

// exports.getUserToDiscussion = (req, res) => {
//   const userId = +req.params.userId
//   sequelize.query(
//     `	SELECT a.username, a.name, a.email, a.address, b.filename, b.filepath, d.title, d.description, d.picture,
//       d.content, c."createdAt", c."updatedAt", e.title, e.description, e.picture, e.message, e."createdAt",
//       e."updatedAt", f.title, f.description, f.picture, f.message, f."createdAt", f."updatedAt" FROM users a
//         JOIN image_profiles b ON a.id = b."userId"
//         JOIN forum_subscriptions c ON a.id = c."userId"
//         JOIN forums d ON c."forumId" = d.id
//         JOIN sub_forums e ON d.id = e."forumId"
//         JOIN forum_posts f ON f."subForumId" = e.id
//       WHERE a.id = '${userId}'
//       ORDER BY a.name`
//   ) .then(usr => {
//     res.json(usr[0])

//   }) .catch(err => {
//     res.send(err)
//   })
// }

//get all forums that include sub forums
exports.forumSubForum = (req, res) => {
  const id = +req.params.id;
  Forum.findAll({
    attributes: ["title", "description", "picture", "content"],
    include: [
      {
        model: SubForum,
        where: { forumId: id },
        attributes: ["id", "title", "description", "picture", "content"],
      },
    ],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(">> Error while findinf Forum: ", err);
    });
};

//get all sub forum that include discussion
exports.subForumDiscussion = (req, res) => {
  const id = +req.params.id;
  SubForum.findAll({
    attributes: ["title", "description", "picture", "content"],
    include: [
      {
        model: ForumPost,
        where: { subForumId: id },
        attributes: ["message", "picture", "createdAt"],
      },
    ],
  })
    .then((forums) => {
      res.json(forums);
    })
    .catch((err) => {
      res.json(">> Error while finding sub forum: ", err);
    });
};

exports.userProfile = (req, res) => {
  const id = +req.params.id;
  User.findAll({
    include: [
      {
        model: ImageProfile,
        where: { userId: id },
      },
    ],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(">> Error while finding sub forum: ", err);
    });
};

exports.forumToPost = (req, res) => {
  const forumId = +req.params.id;
  const subForumId = +req.params.id;
  Forum.findAll({
    include: [
      {
        model: SubForum,
        where: { forumId: forumId },
        include: [
          {
            model: ForumPost,
            where: { subForumId: subForumId },
          },
        ],
      },
    ],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(">> Error while finding sub forum: ", err);
    });
};

//all master data
exports.masterMonitoring = (req, res) => {
  const userId = +req.params.userId;
  const id2 = +req.params.id;

  User.findAll({
    include: [
      {
        model: ForumSubscription,
        where: { userId: userId },
        // through: {attributes: ['userId']},
      },
    ],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(">> Error while finding sub forum: ", err);
    });
};

exports.userRole = (req, res) => {
  const userId = +req.params.userId;
  console.log(userId);
  sequelize
    .query(
      `SELECT a.username, a.name, a.email, b."roleId" FROM users a
  INNER JOIN user_roles b ON a.id = b."userId"
  WHERE a.id = '${userId}'`
    )
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};
