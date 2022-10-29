/** @format */

const db = require("../models");
const Forum = db.forum;
const SubForum = db.sub_forum;
const ForumPost = db.forum_post;
const User = db.user;
const UserRole = db.user_role;
const ImageProfile = db.image_profile;
const ImageForum = db.image_forum;
const Discussion = db.discussion;

const Op = db.Sequelize.Op;
const Role = db.role;

const ForumSubscription = db.forum_subscription;
const path = require("path");
const { image_profile, user_role } = require("../models");
const sequelize = db.sequelize;
const IP = require("ip");
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
exports.joinForum = (req, res) => {
  ForumSubscription.create({
    forumId: req.body.forumId,
    userId: req.body.userId,
    status: req.body.status,
    isRequest: req.body.isRequest,
  })
    .then(() => {
      res.send({ message: "Join was successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//edit join by admin

exports.responseJoin = (req, res) => {
  ForumSubscription.update(req.body, {
    where: {
      forumId: req.body.forumId,
      userId: req.body.userId,
    },
  })    .then(() => {
    res.send({ message: "Update Join was successfully!" });
  })
  .catch((err) => {
    res.status(500).send({ message: err.message });
  });
};
exports.createForum = (req, res) => {
  Forum.create(
    {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      type: req.body.type,
      category: req.body.category,
      status: req.body.status,
      image_forum: {
        filename: "default picture forum",
        // filepath: `${req.protocol}://${IP.address()}:${
        //   req.socket.localPort

        filepath: `${req.protocol}://${req.hostname}:${req.socket.localPort}/public/images/forum/default_image_forum.png`,
      },
    },
    {
      include: [ImageForum],
    }
  )
    .then((user) => {
      if (req.body.userId) {
        User.findAll({
          where: {
            id: req.body.userId,
          },
        }).then((userId) => {
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
  console.log("ini forum id", req.body.forumId);

  SubForum.create({
    title: req.body.title,
    description: req.body.description,
    picture: req.body.picture,
    content: req.body.content,
    message: req.body.message,

    forumId: req.body.forumId,
  })
    .then((forum) => {
      res.send({ message: "Sub Forum was registered successfully!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// sort forum from latest updated
exports.sortForums = (req, res) => {
  Forum.findAll({
    limit: 10,
    order: [["updatedAt", "DESC"]],
    attributes: ["title"],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

//create comment di sub forum masing-masing
exports.createPostComment = (req, res) => {
  Discussion.create({
    // id: req.body.id,
    message: req.body.message,
    // content: req.body.content,
    subForumId: req.body.subForumId,
  })
    .then(() => {
      res.send({ message: "Commnent was created!" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
//update user menjadi admin
exports.updateUser = async (req, res) => {
  // const roleUpdate = req.body.roleId
  await UserRole.update(req.body, {
    where: {
      userId: +req.params.userId,
    },
  });
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
  sequelize
    .query(
      `SELECT f."isRequest", f.status, c.type, c.id, a.name, a.username, a.email, c."createdAt" as "forum_created", c.title, c.description, c.content, d.filepath as "image_forum", e.filepath as "image_user" from users a 
      JOIN forum_subscriptions b ON a.id = b."userId"
      JOIN forums c ON c.id = b."forumId"
      JOIN image_forums d ON c.id = d."forumId"
      JOIN image_profiles e ON a.id = e."userId"
      JOIN forum_subscriptions f ON a.id = f."userId" AND c.id = f."forumId"
      ORDER BY a.id`
    )
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getllRequested = (req,res) => {
  sequelize
    .query(
      `SELECT a.id as user_id, f."isRequest", f.status, c.type, c.id, a.name, a.username, a.email, c."createdAt" as "forum_created", c.title, c.description, c.content, d.filepath as "image_forum", e.filepath as "image_user" from users a 
      JOIN forum_subscriptions b ON a.id = b."userId"
      JOIN forums c ON c.id = b."forumId"
      JOIN image_forums d ON c.id = d."forumId"
      JOIN image_profiles e ON a.id = e."userId"
      JOIN forum_subscriptions f ON a.id = f."userId" AND c.id = f."forumId"
      WHERE f."isRequest" = true
      ORDER BY a.id`
    )
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
}

// exports.getAllForum = async(req, res) => {
//   const forums = await Forum.findAll()
//   res.json(forums)
// }

// get all user
exports.getaAllUser = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

// get all data user relasi dengan imahe
exports.getaAllDataUser = (req, res) => {
  const id = +req.params.id;
  User.findAll({
    attributes: [
      "name",
      "username",
      "address",
      "email",
      "phone",
      "createdAt",
      "updatedAt",
    ],
    // where: { id: id },
    include: [
      {
        model: ImageProfile,
        where: { userId: id },
        attributes: ["filename", "filepath"],
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
  const title = req.query.title;
  const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

  Forum.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving forum title.",
      });
    });
};

//get forum by id
exports.getForumById = (req, res) => {
  // const id = req.params.id
  // Forum.findAll({
  //   include:[
  //     {
  //       model: User,
  //       // as:"user",
  //       where: {forumId: id}
  //     }

  //   ]
  // })
  // .then((data)=>{
  //   res.json(data[0])
  // })
  // .catch((err) => {
  //   res.status(500).send({
  //     message:
  //       err.message || "Some error occurred while retrieving forum detail.",
  //   });
  // });
  const forumId = req.params.forumId;
  sequelize
    .query(
      `SELECT a.name, a.username, a.email, c."createdAt" as "forum created", c.title, c.description, c.content, d.filepath as "image_forum", e.filepath as "image_user" from users a 
  JOIN forum_subscriptions b ON a.id = b."userId"
  JOIN forums c ON c.id = b."forumId"
  JOIN image_forums d ON c.id = d."forumId"
  JOIN image_profiles e ON a.id = e."userId"
  WHERE c.id = ${forumId}
  ORDER BY a.id`
    )
    .then((data) => {
      res.json(data[0][0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.getForumByTitle = async (req, res) => {
  const title = await Forum.findOne({ where: { title: req.params.title } });
  res.json(title);
};
//get all sub forum
exports.getSubForumAll = async (req, res) => {
  const subForums = await SubForum.findAll({
    where: {
      forumId: req.params.id,
    },
  });
  res.send(subForums[0]);
};

// get sub-forum berdasarkan forum
exports.getSubForumByForumId = (req, res) => {
  SubForum.findOne({
    where: { id: +req.params.id },
    include: [Discussion],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(err);
    });
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

//get all forums that include sub forums to comment by forum id

exports.forumDetail = (req, res) => {
  const id = req.params.id;
  Forum.findOne({
    include: [
      ImageForum,
      {
        model: SubForum,
        where: { forumId: id },
        include: [Discussion],
        // limit: 10,
        // offset:10,

        // order: [["updatedAt", "DESC"]],
      },
    ],
  })
    .then((forums) => {
      res.send(forums);
    })
    .catch((err) => {
      res.send(err);
    });
};

//get forum by userID

exports.getForumByUser = (req, res) => {
  User.findOne({
    attributes: [
      "name",
      "username",
      "address",
      "email",
      "phone",
      "createdAt",
      "updatedAt",
    ],
    where: {
      id: req.params.userId,
    },
    include: [
      {
        model: Forum,
        include: [
          {
            model: SubForum,
          },
        ],
      },
    ],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.deleteForum = (req, res) => {
  Forum.destroy({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: SubForum,
      },
    ],
  })
    .then(() => {
      res.json("Success");
    })
    .catch((err) => {
      res.send(err);
    });
};

//get all sub forum that include discussion
exports.subForumDiscussion = (req, res) => {
  const id = +req.params.id;
  SubForum.findOne({
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

//get all discussion by forumid

exports.getAllDiscussion = (req, res) => {
  Discussion.findAll({
    where:{
      subForumId: +req.params.id
    },
    order:[
      ['createdAt', 'DESC'],
    ]
  })  .then((forums) => {
    res.json(forums);
  })
  .catch((err) => {
    res.json(">> Error while finding DIscussion: ", err);
  })
}

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
exports.getUserById = (req, res) => {
  User.findAll({
    where: {
      id: req.params.userId,
    },
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getUserRoleAll = (req, res) => {
  User.findAll({
    attributes: [
      "id",
      "username",
      "name",
      "email",
      "gender",
      "address",
      "phone",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Role,
        attributes: ["name"],
      },
      {
        model: ImageProfile,
        attributes: ["filename", "filepath"],
      },
    ],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.countUser = (req, res) => {
  User.findAll({
    attributes: [[sequelize.literal("COUNT(id)"), "total_user"]],
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.countForum = (req, res) => {
  Forum.findAll({
    attributes: [[sequelize.literal("COUNT(id)"), "total_forum"]],
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.countSubForum = (req, res) => {
  SubForum.findAll({
    attributes: [[sequelize.literal("COUNT(id)"), "total_subforum"]],
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.countComment = (req, res) => {
  Discussion.findAll({
    attributes: [[sequelize.literal("COUNT(id)"), "total_comment"]],
  })
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => {
      res.send(err);
    });
};
