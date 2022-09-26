const morgan = require('morgan')
const json = require('morgan-json');
const os = require('os');
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
  
  exports.format = 
    json({
    remote_address:':remote-addr',
    time: ':date',
    method: ':method',
    url :  ':url',
    http_version :':http-version',
    status: ':status',
    length: ':res[content-length]',
    'response-time': ':response-time ms',
    referrer: ':referrer',
    user_agent:':user-agent',
    conversation_id :':conversation-id',
    hostname :':hostname',
    pid: ':pid'
  });

  // create app log
  exports.accessLogStream = fs.createWriteStream('./public/logging/log.json', {flags: 'a'});
