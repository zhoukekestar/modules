!(function(global){

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

  var events = ['click', 'taphold', 'swipeleft', 'swiperight'];
  events.forEach(function(event) {

    document.body.addEventListener(event, pathFill)
    document.body.addEventListener(event, pathFill, true)

  })

})(window);

