(function(){

  window.onerror = function(msg, file, line) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/log', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      msg: navigator.userAgent + '\n' + location.href + '\n' + file + ':' + line + '\n' + msg
    }));
    alert('抱歉，您的游览器出现异常，如需继续，请尝试其他游览器。');
  }

})(window);
