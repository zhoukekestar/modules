!(function () {

  var init = function () {
    var hasOnendedElements = document.querySelectorAll('[onended]')
    for (var i = 0; i < hasOnendedElements.length; i++) {
      if (!hasOnendedElements[i].onended) {
        hasOnendedElements[i].onended = new Function(hasOnendedElements[i].getAttribute('onended'));
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
   init()
  } else {
   document.addEventListener('readystatechange', function(e) {
     if (document.readyState === 'interactive') {
       init();
     }
   })
  }

  document.body.addEventListener('click', init);
  document.body.addEventListener('touchend', init);

})();
