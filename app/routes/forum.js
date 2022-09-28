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

  //create main forum (admin)
  app.post("/forum/add",
    [authJwt.verifyToken, authJwt.isAdmin], 
    controller.createForum
  )

  //create sub forum (user, admin, superadmin)
  app.post("/forum/sub_forum",
  [authJwt.verifyToken], controller.createSubForum)

  //create discussion in subforum (user, admin, superadmin)
  app.post("/forum/sub_forum/comment",
  [authJwt.verifyToken], controller.createPostComment)

  //update user to admin (super admin)
  app.post("/update/user/:id/role/:id",[authJwt.verifyToken, authJwt.isSuperAdmin], controller.updateUsertoAdmin)

  //delete comment (admin)
  app.post("/delete/comment/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCommenByAdmin)


  // get
  app.get("/forum", controller.getAllForum );
  app.get("/forum/:id",[authJwt.verifyToken],controller.getForumById);

  app.get("forum/subforum",[authJwt.verifyToken],controller.getSubForumAll);
  app.get("/forum/subforum/:id",[authJwt.verifyToken],controller.getSubForumByForumId);

  app.get('/comment/all', [authJwt.verifyToken],controller.getAllComment)
  
  //get all relation of users
  //
  // app.get('/profile/details/:userId', controller.getAllUserProfile)
  // uplodat image profile
  
  app.post('/profile/image/add',[authJwt.verifyToken], controllerImage.upload.single('image'), controllerImage.uploadImage)
  app.post('/forum/image/add',[authJwt.verifyToken], controllerImage.uploadImageF.single('image'), controllerImage.uploadImageForum)
  app.get('/forum/to_post/:forumId/:subForumId',controller.forumToPost)
  app.get('/profile/image/:filename',[authJwt.verifyToken], controller.getImage);
  app.get('/forum/subforum/all/:id',controller.forumSubForum)
  app.get('/forum/subforum/forumpost/:id',controller.subForumDiscussion)
  app.get('/forum/profil/:id',controller.userProfile)
};