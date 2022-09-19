const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const fs = require('fs')
const morgan = require('morgan')
const json = require('morgan-json');

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


app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')))

const format = json({
  short: ':method',
  url :  ':url',
  status: ':status',
  length: ':res[content-length]',
  'response-time': ':response-time ms'
});

// create app log
const accessLogStream = fs.createWriteStream('./public/logging/log.log', {flags: 'a'});
app.use(morgan({format: format, stream: {
  write: function(str)
  {
      accessLogStream.write(str);
  }
}}));

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

require('./app/routes/auth')(app);
require('./app/routes/forum')(app);


// set port, listen for requests
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});