(function(global){

  // For Android 4.3- (included)
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
  })

})(window);

