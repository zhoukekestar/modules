!(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    factory();
  }
}(function() {

  var init = function() {
    // @see https://github.com/jquery/jquery-mobile/blob/master/js/events/touch.js
    !(function() {

      var pressTimer
      document.addEventListener('touchstart', function (e) {
        pressTimer = window.setTimeout(function() {
          e.preventDefault()
          e.target.dispatchEvent(new Event('taphold', {bubbles: true}));
        }, 550)
      })

      document.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
      })

      document.addEventListener('touchmove', function(e) {
        clearTimeout(pressTimer);
      })

    })();

    // swipe
    !(function() {

      var startX, startY;
      var dispatched = false;
      document.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].pageX || e.pageX;
        startY = e.changedTouches[0].pageY || e.pageY;

        // console.log(e.changedTouches[0].pageX + ' ' + e.changedTouches[0].pageY)
      })

      document.addEventListener('touchend', function(e) {
        // console.log(e.changedTouches[0].pageX + ' ' + e.changedTouches[0].pageY)
        dispatched = false;
      })

      document.addEventListener('touchmove', function(e) {
        var currentX = e.changedTouches[0].pageX || e.pageX,
          currentY = e.changedTouches[0].pageY || e.pageY;
        if (!dispatched && Math.abs(currentX - startX) > 50 && Math.abs(currentY - startY) < 10) {

          dispatched = true;
          currentX > startX ?
            e.target.dispatchEvent(new Event('swiperight', {bubbles: true})) :
            e.target.dispatchEvent(new Event('swipeleft', {bubbles: true}));
        }
        // console.log(currentX + ' ' + currentY)
      })

    })();
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

  return null;

}));
