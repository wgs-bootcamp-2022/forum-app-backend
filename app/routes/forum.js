const controller = require("../controllers/forum");
const controllerImage = require("../controllers/upload");

const { authJwt } = require("../middleware");


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
  app.post("/forum/add",

    controller.createForum
  )

  //create sub forum (user, admin, superadmin)
  app.post("/forum/sub_forum",
    [authJwt.verifyToken], controller.createSubForum)

  //create discussion in subforum (user, admin, superadmin)
  app.post("/forum/sub_forum/comment",
    [authJwt.verifyToken], controller.createPostComment)

  //update user to admin (super admin)
  app.put("/update/user/:userId", [authJwt.verifyToken, authJwt.isSuperAdmin], controller.updateUsertoAdmin)

  //delete comment (admin)
  app.post("/delete/comment/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCommenByAdmin)


  // get
  app.get("/forum", controller.getAllForum);
  app.get("/forum/:id", [authJwt.verifyToken], controller.getForumById);
  // app.get("/forum/search", [authJwt.verifyToken], controller.getForumByTitle);
  app.get('/user/profile/forum/:userId', controller.getAllUserProfileForum)

  app.get("forum/subforum", [authJwt.verifyToken], controller.getSubForumAll);
  app.get("/forum/subforum/:id", [authJwt.verifyToken], controller.getSubForumByForumId);


  app.get('/comment/all', [authJwt.verifyToken], controller.getAllComment)

  //get all relation of users
  //
  // app.get('/profile/details/:userId', controller.getAllUserProfile)
  // // uplodat image profile


    //
    app.get('/profile/details/:id', controller.getaAllDataUser)

    app.get('/forum/search/query', controller.findByTitle)

    // uplodat image profile
  
  app.post('/profile/image/add', controllerImage.removeImageProfile, controllerImage.upload.single('image'), controllerImage.uploadImage)
  app.post('/forum/image/add', controllerImage.removeImageForum, controllerImage.uploadImageF.single('image'), controllerImage.uploadImageForum)
  app.get('/forum/to_post/:forumId/:subForumId', controller.forumToPost)
  app.get('/profile/image/:filename',controller.getImage);
  app.get('/forum/subforum/all/:id', controller.forumSubForum)
  app.get('/forum/subforum/forumpost/:id', controller.subForumDiscussion)
  app.get('/forum/profil/:id', controller.userProfile)

  app.get('/user/profil/:userId', controller.userRole)

  app.get('/test', (req, res) => {
    res.json('welcome to my app')
  })
  app.get('/user', [authJwt.verifyToken, authJwt.isAdmin], controller.getaAllUser)
};