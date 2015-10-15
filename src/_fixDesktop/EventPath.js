(function(global){

  // 360 7.1-
  document.body.addEventListener('click', function(e) {
    if (!e.path) {
      e.path = [];
      var t = e.target;
      while (t !== document) {
        e.path.push(t);
        t = t.parentNode;
      }
      e.path.push(document);
      e.path.push(window);
    }
  }, true)

})(window);

