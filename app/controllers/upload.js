const db = require("../models");
const multer = require('multer');
const ImageProfile = db.image_profile
const ImageForum = db.image_forum

const fs = require('fs');
const User = db.user
const Forum = db.forum

const { readdirSync, rmSync } = require('fs');

exports.removeImageProfile = async (req, res, next) => {
  //hapus dir local
  const id = req.query.userId
  const dir = `public/images/user/${id}`;
  const datas = await User.findAll({
    where: {
      id: id
    }
  })
  // create folder berdasarkan user id
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  // hapus directory berdasarkan id
  if(id == datas[0].id.toString()) {
    readdirSync(dir).forEach(f => rmSync(dir+`/${f}`));
  } 

  // hapus database berdasarkan id
  await ImageProfile.destroy({
    where: {
      userId: id
    },
  })
  next()
}


exports.removeImageForum = async (req, res, next) => {
  //hapus dir local
  const id = req.query.forumId
  const dir = `public/images/forum/${id}`;
  const datas = await Forum.findAll({
    where: {
      id: id
    }
  })
  // create folder berdasarkan user id
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  // hapus directory berdasarkan id
  if(id == datas[0].id.toString()) {
    readdirSync(dir).forEach(f => rmSync(dir+`/${f}`));
  } 

  // hapus database berdasarkan id
  await ImageForum.destroy({
    where: {
      forumId: id
    },
  })
  next()
}

// exports.addDir = (req, res, next) => {
//   const id = req.query.userId
//   fs.mkdir(`public/images/user/${id}`,function(e){
//     if(!e || (e && e.code === 'EEXIST')){
//         //do something with contents
//     } else {
//         //debug
//         console.log(e);
//     }
//   });
//   next()
// }

exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const id = req.query.userId
      const dir = `public/images/user/${id}`
      cb(null, dir);
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

exports.uploadImageF = multer({
  storage: multer.diskStorage(
    {
      destination: function (req, file, cb) {
        const id = req.query.forumId
        const dir =  `public/images/forum/${id}`
        cb(null,dir);
      },
      filename: function (req, file, cb) {
        cb(
          null,
          'forum_picture_' +
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

exports.uploadImageForum = (req, res) => {
  const { filename, mimetype, size } = req.file;
  const filepath = req.file.path;
  const forumId = req.body.forumId
  ImageForum.create({
    filename,
    filepath,
    mimetype,
    size,
    forumId
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