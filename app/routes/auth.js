const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth");
const defaultImage = require("../controllers/upload") 

module.exports = function(app) {
  app.use(function(req, res, next) {
    
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get('/signup',controller.signup)
  app.post(
    "/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    // defaultImage.uploadDefaultImage,
    controller.signup,
  );

  app.post("/signin", controller.signin);
};