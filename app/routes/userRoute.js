/** @format */

const controller = require("../controllers/forum");
const controllerImage = require("../controllers/upload");
const logController = require("../controllers/log");
const { authJwt } = require("../middleware");
const auth = require("./auth");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //create main forum (admin)
  app.get("/comment/all", [authJwt.verifyToken], controller.getAllComment);

  app.get(
    "/profile/details/:id",
    [authJwt.verifyToken],
    controller.getaAllDataUser
  );

  //create sub forum (user, admin, superadmin)
  app.post(
    "/forum/sub_forum",
    [authJwt.verifyToken],
    controller.createSubForum
  );

  //create discussion in subforum (user, admin, superadmin)
  app.post(
    "/forum/sub_forum/comment",
    [authJwt.verifyToken],
    controller.createPostComment
  );

  // get
  app.get("/forum", controller.getAllForum);

  app.get("/forum/:forumId", [authJwt.verifyToken], controller.getForumById);
  // app.get("/forum/search", [authJwt.verifyToken], controller.getForumByTitle);
  app.get("/user/profile/forum/:userId", controller.getAllUserProfileForum);

  // app.get("forum/subforum/:id", [authJwt.verifyToken], controller.getSubForumAll);
  app.get(
    "/forum/subforum/:id",
    [authJwt.verifyToken],
    controller.getSubForumByForumId
  );

  app.get("/comment/all", [authJwt.verifyToken], controller.getAllComment);

  app.get(
    "/profile/details/:id",
    [authJwt.verifyToken],
    controller.getaAllDataUser
  );

  app.get("/forum/search/query", controller.findByTitle);

  // uplodat image profile

  app.post(
    "/profile/image/add/:userId",
    [authJwt.verifyToken],
    controllerImage.removeImageProfile,
    controllerImage.upload.single("image"),
    controllerImage.uploadImage
  );

  app.post(
    "/forum/subforum/image/add/:subForumId",
    [authJwt.verifyToken],
    controllerImage.removeImageSubForum,
    controllerImage.uploadImageSubF.single("image"),
    controllerImage.uploadImageSubForum
  );

  app.get(
    "/forum/subforum/all/:id",
    [authJwt.verifyToken],
    controller.forumDetail
  );
  app.get("/forum/subforum/forumpost/:id", controller.subForumDiscussion);
  app.get(
    "/forum/subforum/discussion/all/:id",
    [authJwt.verifyToken],
    controller.getAllDiscussion
  );
  app.post("/forum/join", [authJwt.verifyToken], controller.joinForum);
  app.get("/user/:userId", [authJwt.verifyToken], controller.getUserById);


  //   app.get("/forum/to_post/:forumId/:subForumId", controller.forumToPost);
  //   app.get("/profile/image/:filename", controller.getImage);
  //   app.get("/forum/profil/:id", controller.userProfile);

  //   app.get("/user/profil/:userId", controller.userRole);

  //   app.get("/forum/all/sort_update", controller.sortForums);

};
