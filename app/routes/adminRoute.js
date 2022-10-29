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
  app.post(
    "/forum/add",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createForum
  );

  //delete comment (admin)
  app.post(
    "/delete/comment/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteCommenByAdmin
  );

  app.get(
    "/forum/request",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getllRequested
  );

  app.post(
    "/forum/image/add/:forumId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controllerImage.removeImageForum,
    controllerImage.uploadImageF.single("image"),
    controllerImage.uploadImageForum
  );

  //   app.get("/forum/subforum/all/:id", [authJwt.verifyToken],controller.forumDetail);
  //   app.get("/forum/subforum/forumpost/:id",[authJwt.verifyToken], controller.subForumDiscussion);

  app.put(
    "/forum/join/response",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.responseJoin
  );

  app.get(
    "/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getaAllUser
  );

  app.delete(
    "/forum/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteForum
  );

  app.get(
    "/forum/user/all/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getForumByUser
  );

  app.get("/log", [authJwt.verifyToken, authJwt.isAdmin], logController.getLog);
};
