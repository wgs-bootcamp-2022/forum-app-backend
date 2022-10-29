/** @format */

const controller = require("../controllers/forum");
const controllerImage = require("../controllers/upload");
const logController = require("../controllers/log")
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

  //update user to admin (super admin)
  app.put(
    "/update/user/:userId",
    [authJwt.verifyToken, authJwt.isSuperAdmin],
    controller.updateUser
  );
  app.get("/user/roles/all", [authJwt.verifyToken, authJwt.isSuperAdmin],controller.getUserRoleAll);
  app.get("/user/count/total", [authJwt.verifyToken,authJwt.isSuperAdmin],controller.countUser);
  app.get("/forum/count/total",  [authJwt.verifyToken,authJwt.isSuperAdmin],controller.countForum);
  app.get("/subforum/count/total",[authJwt.verifyToken,authJwt.isSuperAdmin], controller.countSubForum);
  app.get("/comment/count/total", [authJwt.verifyToken, authJwt.isSuperAdmin],controller.countComment);

};
