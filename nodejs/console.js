

var showLine = true;

console._log = console.log;
console._info = console.info;
console._warn = console.warn;
console._error = console.error;

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
   at getCurrentLine (g:\svn\m.toomao.com\lib\console.js:21:13)
   at Console.console.log (g:\svn\m.toomao.com\lib\console.js:31:53)
   at Object.<anonymous> (g:\svn\m.toomao.com\app.js:68:11)
   at Module._compile (module.js:460:26)


   Example 2:
   at getCurrentLine (g:\svn\m.toomao.com\lib\console.js:21:13)
   at Console.console.log (g:\svn\m.toomao.com\lib\console.js:31:53)
   at g:\svn\m.toomao.com\routes\shop.js:44:11
   at Layer.handle [as handle_request] (g:\svn\m.toomao.com\node_modules\express\lib\router\layer.js:82:5)
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

var toString = function(msg) {
  if (typeof msg === "object") {
    try {
      return JSON.stringify(msg)
    } catch (e) {
      return ""
    }
  }

  return msg;
}

console.log = function(msg) {

  msg = toString(msg)
  if (!showLine)
    console._log('[' + format(new Date()) + '] ' + msg);
  else
    console._log('[' + format(new Date()) + '] (' + getCurrentLine() + ') ' + msg);

  // TODO 使用http Post将当前msg输出到日志系统
}

console.info = function(msg) {

  msg = toString(msg)
  if (!showLine)
    console._info('[' + format(new Date()) + '] ' + msg);
  else
    console._info('[' + format(new Date()) + '] (' + getCurrentLine() + ') ' + msg);
}

console.warn = function(msg) {

  msg = toString(msg)
  if (!showLine)
    console._warn('[' + format(new Date()) + '] ' + msg);
  else
    console._warn('[' + format(new Date()) + '] (' + getCurrentLine() + ') ' + msg);
}

console.error = function(msg, note) {

  msg = toString(msg)
  if (!showLine)
    console._error('[' + format(new Date()) + '] ' + msg);
  else
    console._error('[' + format(new Date()) + '] (' + getCurrentLine() + ') ' + msg);
}

module.exports = console;
