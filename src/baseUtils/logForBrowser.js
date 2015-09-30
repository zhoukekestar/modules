(function(){

  window.onerror = function(msg, file, line) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/log', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
      msg: navigator.userAgent + '\n' + location.href + '\n' + file + ':' + line + '\n' + msg
    }));
  }

})(window);
