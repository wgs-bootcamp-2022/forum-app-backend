/** @format */

const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const db = require("./app/models");
const Role = db.role;
const User = db.user;
const Op = db.Sequelize.Op;

const ImageProfile = db.image_profile;
const morganMiddleware = require("./app/middleware/log");
const bcrypt = require("bcryptjs");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initial();
});
// db.sequelize.sync();

app.use(cors());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false })); // Untuk parsing body request
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(morganMiddleware);

// app.set('layout', './layout/home')
// app.set('view engine', 'ejs');

app.use(express.static("public"));

function initial(req, res) {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "admin",
  });

  Role.create({
    id: 3,
    name: "superadmin",
  });

  // User.create(
  //   {
  //     username: "admin",
  //     name: "yahya",
  //     email: "yahyazakaria17@gmail.com",
  //     password: bcrypt.hashSync("yahyazakaria", 8),
  //     image_profile: {
  //       filename: "default_image_profile.png",
  //       filepath: `http://localhost:5000/public/images/user/default_image_profile.png`,
  //     },
  //     address: "Bandung, Jawa Barat",
  //     roles:["admin"]
  //   },
  //   {
  //     include: [ImageProfile],
  //   }
  // )
}

require("./app/routes/auth")(app);
require("./app/routes/adminRoute")(app);
require("./app/routes/userRoute")(app);
require("./app/routes/superAdminRoute")(app);


// set port, listen for requests
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
