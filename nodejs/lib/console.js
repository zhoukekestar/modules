

var showLine = true,
    // Block list.
    bLog    = [],
    bInfo   = [],
    bWarn   = [],
    bErr    = [],
    bList   = [],
    lineMsg;

console._log    = console.log;
console._info   = console.info;
console._warn   = console.warn;
console._error  = console.error;

function format(d) {
  return d.getHours() + ':' + d.getMinutes() + ":" + d.getSeconds();
}

function getCurrentLine() {

  // @see http://stackoverflow.com/questions/6715571/how-to-get-result-of-console-trace-as-string-in-javascript-with-chrome-or-fire
  var getStackTrace = function() {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
  };

  /*
   Example 1:
   at getCurrentLine (***\lib\console.js:21:13)
   at Console.console.log (***\lib\console.js:31:53)
   at Object.<anonymous> (***\app.js:68:11)
   at Module._compile (module.js:460:26)


   Example 2:
   at getCurrentLine (***\lib\console.js:21:13)
   at Console.console.log (***\lib\console.js:31:53)
   at ***\routes\shop.js:44:11
   at Layer.handle [as handle_request] (***\node_modules\express\lib\router\layer.js:82:5)
   */
  var str = getStackTrace();

  str = str.split('\n')[3];

  // Example 1
  if (str.indexOf('(') !== -1) {
    str = str.substring(str.indexOf('(') + 1, str.indexOf(')'));

  // Example 2
  } else {
    str = str.substr(str.indexOf('at') + 3);
  }
  return str;
}

function toString(msg) {
  if (typeof msg === "object") {
    try {
      return JSON.stringify(msg)
    } catch (e) {
      return ""
    }
  }

  return msg;
}


function isInBlockList(msg, level) {

  if (level === 1) {
    bList = bLog;
  } else if (level === 2) {
    bList = bInfo
  } else if (level === 3) {
    bList = bWarn
  } else {
    bList = bErr;
  }

  for (var i = 0, max = bList.length; i < max; i++) {
    if (msg.indexOf(bList[i]) !== -1) {
      return true
    }
  }
  return false;
}


console.log = function(msg) {

  msg = toString(msg)
  lineMsg = getCurrentLine();

  if (isInBlockList(lineMsg, 1)) return;

  if (!showLine)
    console._log('[' + format(new Date()) + '] ' + msg);
  else
    console._log('[' + format(new Date()) + '] (' + lineMsg + ') ' + msg);

  // TODO 使用http Post将当前msg输出到日志系统
}

console.info = function(msg) {

  msg = toString(msg)
  lineMsg = getCurrentLine();

  if (isInBlockList(lineMsg, 2)) return;

  if (!showLine)
    console._info('[' + format(new Date()) + '] ' + msg);
  else
    console._info('[' + format(new Date()) + '] (' + lineMsg + ') ' + msg);
}

console.warn = function(msg) {

  msg = toString(msg)
  lineMsg = getCurrentLine();

  if (isInBlockList(lineMsg, 3)) return;

  if (!showLine)
    console._warn('[' + format(new Date()) + '] ' + msg);
  else
    console._warn('[' + format(new Date()) + '] (' + lineMsg + ') ' + msg);
}

console.error = function(msg) {

  msg = toString(msg)

  lineMsg = getCurrentLine();

  if (isInBlockList(lineMsg, 4)) return;

  if (!showLine)
    console._error('[' + format(new Date()) + '] ' + msg);
  else
    console._error('[' + format(new Date()) + '] (' + lineMsg + ') ' + msg);
}

module.exports = function(log, info, warn, err) {
  log   !== undefined && (bLog  = log);
  info  !== undefined && (bInfo = info);
  warn  !== undefined && (bWarn = warn);
  err   !== undefined && (bErr  = err);

  return console;
};
