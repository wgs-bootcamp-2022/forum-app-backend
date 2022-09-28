const controller = require("../controllers/forum");
const controllerImage = require("../controllers/upload");

const { authJwt } = require("../middleware");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/forum/sub_forum",
  [authJwt.verifyToken], controller.createSubForum)

  //create discussion in subforum (comment)
  app.post("/forum/sub_forum/comment",
  [authJwt.verifyToken], controller.createPostComment)

  // upload forum picture
  app.post('/forum/image/add',[authJwt.verifyToken], controllerImage.uploadImageF.single('image'), controllerImage.uploadImageForum)

  // get
  app.get("/forum", controller.getAllForum );
  app.get("/forum/:id",[authJwt.verifyToken],controller.getForumById);
  app.get("forum/subforum",[authJwt.verifyToken],controller.getSubForumAll);
  app.get("/forum/subforum/:id",[authJwt.verifyToken],controller.getSubForumByForumId);
  app.get('/forum/profil/:id',[authJwt.verifyToken], controller.userProfile)
  app.get('/profile/image/:filename',[authJwt.verifyToken], controller.getImage);
  
  app.get('/forum/subforum/forumpost/:id',controller.subForumDiscussion)

  app.get('/forum/to_post/:forumId/:subForumId',controller.forumToPost)
  app.get('/forum/monitoring/:userId',controller.getAllUserProfileForum)
};