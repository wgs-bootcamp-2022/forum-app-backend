const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const fs = require('fs')
const morgan = require('morgan')
const json = require('morgan-json');
const expressLayouts = require('express-ejs-layouts')
const os = require('os')
const log = require('./app/middleware')
const db = require("./app/models");
const Role = db.role;


db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});
// db.sequelize.sync();

app.use(cors())
app.use(expressLayouts)
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('layout', './layout/home')
app.use(express.urlencoded({ extended: true })); // Untuk parsing body request
app.set('view engine', 'ejs');

morgan.token('conversation-id', function getConversationId(req) {
  return req.conversationId;
});
morgan.token('session-id', function getSessionId(req) {
  return req.sessionId;
});
morgan.token('instance-id', function getInstanceId(req) {
  return req.instanceId;
});
morgan.token('hostname', function getHostname() {
  return os.hostname();
});
morgan.token('pid', function getPid() {
  return process.pid;
});

const format = json({
  time: ':date',
  method: ':method',
  url :  ':url',
  http_version :':http-version',
  status: ':status',
  length: ':res[content-length]',
  'response-time': ':response-time ms',
  user_agent:':user-agent',
  session_id :':session-id',
  hostname :':hostname',
  instance : ':instance-id',
  pid: ':pid'
});

// // create app log
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
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});