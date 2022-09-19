const jwt = require("jsonwebtoken");
const config = require("../config/auth.js");
const db = require("../models");
const User = db.user;
const morgan = require('morgan');
const fs = require('fs')
const filepath = './public/log.json'


exports.log = ()=> {
  const morganLog = morgan(':method :url :status :response-time ms - :res[content-length]');
  const readFIle = fs.readFileSync(filepath,'utf-8')
  const datas = JSON.parse(readFIle)
  datas.push(morganLog)
  fs.writeFileSync(filepath,JSON.stringify(datas))
}

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isSuperAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "superadmin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Super Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSuperAdmin: isSuperAdmin,
};
module.exports = authJwt;