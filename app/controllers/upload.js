const db = require("../models");
const multer = require('multer');
const ImageProfile = db.image_profile

exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/user');
    },
    filename: function (req, file, cb) {
    cb(
      null,
      'profil_picture_' +
      new Date().valueOf() + 
      '_' +
      file.originalname
      );
    }
  }), 
});

exports.uploadImageForum = multer({
  storage: multer.diskStorage(
    {
      destination: function (req, file, cb) {
          cb(null, 'public/images/forum');
      },
      filename: function (req, file, cb) {
        cb(
          null,
          new Date().valueOf() + 
          '_' +
          file.originalname
        );
      }
    }
  ), 
});

exports.uploadImage = (req, res) => {
  const { filename, mimetype, size } = req.file;
  const filepath = req.file.path;
  const userId = req.body.userId
  ImageProfile.create({
    filename,
    filepath,
    mimetype,
    size,
    userId
  }).then(user => {
      res.json({ success: true, filename })
    })
    .catch(err => res 
      .json(
        {
          success: false, 
          message: 'not found', 
          stack: err.stack,
        }
      )
  );
}