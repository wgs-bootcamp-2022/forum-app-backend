const db = require("../models");
const multer = require('multer');
const ImageProfile = db.image_profile
const ImageForum = db.image_forum
const ImageSubForum = db.image_subforum


const fs = require('fs');
const User = db.user
const Forum = db.forum

const { readdirSync, rmSync } = require('fs');

// menghapus image profil file yang sudah ada jika melakukan upload
exports.removeImageProfile = async (req, res, next) => {
  //hapus dir local
  const id = req.params.userId
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

// menghapus image forum file yang sudah ada jika melakukan upload

exports.removeImageForum = async (req, res, next) => {
  //hapus dir local
  const id = req.params.forumId
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

//proses upload foto ke lokal storage
exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const id = req.params.userId
      //foto disimpan berdasarkan direktori id
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

//proses upload foto forum ke lokal storage
exports.uploadImageF = multer({
  storage: multer.diskStorage(
    {
      destination: function (req, file, cb) {
        const id = req.params.forumId
      //foto disimpan berdasarkan direktori id
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

//proses upload informasi file image user ke database
exports.uploadImage = (req, res) => {
  const { filename, mimetype, size } = req.file;
  //mengubah format filepah agar bisa di dislay di frontend
  const filepath = `${req.protocol}://${req.headers.host}/public`+req.file.path.replace(/\\/g, "/").substring("public".length)
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

//proses upload informasi file image forum ke database
exports.uploadImageForum = (req, res) => {
  const { filename, mimetype, size } = req.file;
  //mengubah format filepah agar bisa di dislay di frontend
  const filepath = `${req.protocol}://${req.headers.host}/public`+req.file.path.replace(/\\/g, "/").substring("public".length)
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

exports.removeImageSubForum = async (req, res, next) => {
  //hapus dir local
  const id = req.params.subForumId
  const dir = `public/images/forum/subforum/${id}`;
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
  await ImageSubForum.destroy({
    where: {
      subForumId: id
    },
  })
  next()
}


//proses upload foto forum ke lokal storage
exports.uploadImageSubF = multer({
  storage: multer.diskStorage(
    {
      destination: function (req, file, cb) {
        const id = req.params.subForumId
      //foto disimpan berdasarkan direktori id
        const dir =  `public/images/forum/subforum/${id}`
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


//proses upload informasi file image forum ke database
exports.uploadImageSubForum = (req, res) => {
  const { filename, mimetype, size } = req.file;
  //mengubah format filepah agar bisa di dislay di frontend
  const filepath = `${req.protocol}://${req.headers.host}/public`+req.file.path.replace(/\\/g, "/").substring("public".length)
  const subForumId = req.body.subForumId
  ImageForum.create({
    filename,
    filepath,
    mimetype,
    size,
    subForumId
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