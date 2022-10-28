/** @format */

const morgan = require("morgan");
const json = require("morgan-json");
const os = require("os");
const db = require("../models");
const Log = db.log;

morgan.token("conversation-id", function getConversationId(req) {
  return req.conversationId;
});
morgan.token("session-id", function getSessionId(req) {
  return req.sessionId;
});
morgan.token("instance-id", function getInstanceId(req) {
  return req.instanceId;
});
morgan.token("hostname", function getHostname() {
  return os.hostname();
});
morgan.token("pid", function getPid() {
  return process.pid;
});
const format = json({
  time: ":date",
  method: ":method",
  url: ":url",
  http_version: ":http-version",
  status: ":status",
  length: ":res[content-length]",
  "response-time": ":response-time ms",
  user_agent: ":user-agent",
  session_id: ":session-id",
  hostname: ":hostname",
  instance: ":instance-id",
  pid: ":pid",
});

exports.appLog = (req, res) => {
  Log.create({
    session_id: req.sessionId,
  })
    .then((forums) => {
      res.json("oke");
    })
    .catch((err) => {
      res.json(">> Error while finding sub forum: ", err);
    });
};
