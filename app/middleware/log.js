/** @format */
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const json = require("morgan-json");
const os = require("os");
const db = require("../models");
const Log = db.log;
const config = require("../config/auth.js");
const stream = {
  write: async (message) => {
    const data = message.split(' ', 6);
    const user = JSON.parse(message.split(' ')[6]);

    try {
      await Log.create({
        username: user.length > 0 ? user[0] : '-',
        email: user.length > 0 ? user[1] : '-',
        client_ip: data[0],
        request_method: data[1],
        endpoint: data[2],
        status_code: data[3],
        content_length: data[4],
        response_time: data[5],
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

// const skip = () => {
//   const env = process.env.NODE_ENV || 'development';
//   return env !== 'development';
// };

morgan.token('user', (req) => {
  const token = req.headers['x-access-token']
  console.log("ini token sec", config.refresh)
  const user = []
  if (token) {
    jwt.verify(token, config.secret, (err, decoded)  => {
      user.push(decoded ? decoded.username : 'Anonymous' , decoded ? decoded.email : 'Anonymous')
    });
  }
  return JSON.stringify(user)
});

const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] :response-time :user', { stream });

module.exports = morganMiddleware;