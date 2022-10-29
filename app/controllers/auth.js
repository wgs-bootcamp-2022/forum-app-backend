/** @format */

const db = require("../models");
const config = require("../config/auth");
const User = db.user;
const Role = db.role;
const ImageProfile = db.image_profile;
const IP = require("ip");

const Op = db.Sequelize.Op;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signGoogle = async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  const user = await User.create({
    where: { email: email },
    update: { name, picture },
    create: { name, email, picture },
  });
  res.status(201);
  res.json(user);
};

exports.signup = (req, res) => {
  // Save User to Database
  User.create(
    {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      //otomatis tambah foto profil ketika register
      image_profile: {
        filename: "default_image_profile.png",
        // filepath: `${req.protocol}://${IP.address()}:${req.socket.localPort}/public/images/user/default_image_profile.png`,
        filepath: `${req.protocol}://${req.hostname}:${req.socket.localPort}/public/images/user/default_image_profile.png`,
      },
      // defaultPicture:  `${req.protocol}://${req.headers.host}/public/images/user/default_image_profile.png`,
      address: req.body.address,
    },
    {
      include: [ImageProfile],
    }
  )
    // get role berdasarkan nama
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// proses signin
exports.signin = (req, res) => {
  // get user berdasarkan username
  console.log("ini ", typeof req.body.username);

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // valiadasi jika
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // jika password invalid
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const authorities = [];
      console.log("ini roles",authorities[0])
      // get role lalu tanpilkan di respons
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });

      // variabel get token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        config.secret,
        {
          expiresIn: 60, // 1minute
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        config.refresh,
        {
          expiresIn: "1d",
        }
      );

      User.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: user.id,
          },
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    })

    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
