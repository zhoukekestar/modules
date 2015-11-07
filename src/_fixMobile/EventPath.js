(function(global){

  // For Android 4.3- (included)
  var pathFill = function() {
    var e = arguments[0];

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
  }

  document.body.addEventListener('click', pathFill);
  document.body.addEventListener('click', pathFill, true);

})(window);

