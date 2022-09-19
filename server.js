const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const path = require('path');
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

// parse requests of content-type - application/json
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "admin"
  });
 
  Role.create({
    id: 3,
    name: "superadmin"
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth')(app);
require('./app/routes/forum')(app);


// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});