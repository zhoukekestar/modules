(function(){
  /*
  Uglify this css by: http://tool.lu/css
  body > .log-for-browser-alert {
    position: fixed;
    top: -2em;
    left: 0;
    width: 100%;
    background-color:rgba(217, 83, 79, 0.78);
    font-size: 12px;
    text-align: center;
    transition: all 1s;
    color: #fff;
    box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.16);
    z-index: 9999;
    line-height: 1.8em;
  }
  */
  var logForBrowserAlertCss = 'body>.log-for-browser-alert{position:fixed;top:-2em;left:0;width:100%;background-color:rgba(217,83,79,.78);font-size:12px;text-align:center;transition:all 1s;color:#fff;box-shadow:0 0 5px 1px rgba(255,255,255,.16);z-index:9999;line-height:1.8em}';
  var logForBrowserAlertDiv = null;
  window.logForBrowserAlert = function(msg) {

    if (!logForBrowserAlertDiv) {
      logForBrowserAlertDiv = document.createElement('div');
      logForBrowserAlertDiv.classList.add('log-for-browser-alert');
      document.body.appendChild(logForBrowserAlertDiv);

      var style = document.createElement('style');
      style.innerHTML = logForBrowserAlertCss;
      document.head.appendChild(style)
    }

    logForBrowserAlertDiv.innerHTML = msg;
    setTimeout(function(){
      logForBrowserAlertDiv.style.top = '-4em';
    }, 6000)
    setTimeout(function(){
      logForBrowserAlertDiv.style.top = 0;
    }, 10)
  }

  /* Make sure init function run once. */
  if (window.logForBrowser) {
    return;
  }
  window.logForBrowser = true;

  console._error = console.error;
  console.error = function(msg, url, line, col, err) {
    url   = url   || 'local';
    line  = line  || 1;
    col   = col   || 1;
    err   = (err  && err.stack) || "NO STACK";

    var log = {
      ua        : navigator.userAgent,
      location  : location.href,
      msg       : msg,
      scripturl : url,
      line      : line,
      column    : col,
      stack     : err
    }

    console.log(log);

    ;new Image().src = '//common.toomao.com/log?log=' + encodeURIComponent(JSON.stringify(log));

    if (needReload) {
      setTimeout(function(){
        location.reload();
      }, 100)
    }
  }

  // Safe JSON parser.
  JSON._parse = JSON.parse;
  JSON.parse = function(str) {
    try {
      return JSON._parse(str);
    } catch (e) {
      console.error('JSON.parse error, str:' + str, 'logForBrowser.js', 0, 0, e);
      return {};
    }
  }


  var needReload = false;
  window.onerror = function(msg, url, line, col, err) {

    // chrome browser's error. Ignore it.
    if (msg.indexOf("Uncaught TypeError: Cannot read property 'description' of undefined") !== -1) {
      return;
    }

    var logForBrowserObj = (localStorage['logForBrowser'] && JSON.parse(localStorage['logForBrowser'])) || ({retry : 1, time: Date.now()});
    needReload = false;

    // Last error was shown 10 seconds ago.
    // Reset retry.
    if (Date.now() - logForBrowserObj.time > 30000) {
      logForBrowserObj = {retry : 1, time: Date.now()}
    }

    if (msg.indexOf('pingpp') !== -1) {
      if (logForBrowserObj.retry < 4) {

        msg += ' retry:' + logForBrowserObj.retry;
        logForBrowserObj.retry++;
        localStorage['logForBrowser'] = JSON.stringify(logForBrowserObj)

        needReload = true;
        console.error(msg, url, line, col, err)
        return;
      }
      logForBrowserAlert('支付模块未能加载，请稍后重试');
      console.error(msg, url, line, col, err)
    } else if (msg.indexOf('WeixinJSBridge') !== -1) {

      if (logForBrowserObj.retry < 4) {

        msg += ' retry:' + logForBrowserObj.retry;
        logForBrowserObj.retry++;
        localStorage['logForBrowser'] = JSON.stringify(logForBrowserObj)

        needReload = true;
        console.error(msg, url, line, col, err)
        return;
      }

      logForBrowserAlert('微信游览器初始化错误，请稍后重试');
      console.error(msg, url, line, col, err)
    } else if (msg.indexOf('Script error') !== -1) {

      if (logForBrowserObj.retry < 4) {

        msg += ' retry:' + logForBrowserObj.retry;
        logForBrowserObj.retry++;
        localStorage['logForBrowser'] = JSON.stringify(logForBrowserObj)

        needReload = true;
        console.error(msg, url, line, col, err)
        return;
      }

      if (confirm('网页加载过慢，建议刷新一下')) {
        location.reload();
      }
      console.error(msg, url, line, col, err)
    } else if (msg.indexOf('Illegal constructor') !== -1) {
      logForBrowserAlert('好吧...您的游览器可能有点旧了,有空更新一下吧~');
      console.error(msg, url, line, col, err)
    } else {
      // 未知异常，减少重试次数
      if (logForBrowserObj.retry < 3) {

        msg += ' retry:' + logForBrowserObj.retry;
        logForBrowserObj.retry++;
        localStorage['logForBrowser'] = JSON.stringify(logForBrowserObj)

        needReload = true;
        console.error(msg, url, line, col, err)
        return;
      }

      logForBrowserAlert('不会吧~页面不可能发生错误的！一定是你的打开方式不对,用其他游览器打开看看咯~');
      console.error(msg, url, line, col, err)
    }
  }

})(window);
