!(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    factory();
  }
}(function() {

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    // For invisible element.
    if (rect.top + rect.bottom + rect.left + rect.right + rect.height + rect.width === 0) {
      return false;
    }

    return (
       rect.top   >= 0
    // Pre load.
    && rect.top   <= ((window.innerHeight || document.documentElement.clientHeight) + 100)
    && rect.left  >= 0
    // Hide carousel except first image. Do not add equal sign.
    && rect.left  < (window.innerWidth || document.documentElement.clientWidth)
    )
  }


  function processScroll() {

  }

  var init = function(reload) {

    processScroll();

    if (!reload) {
      window.addEventListener('scroll', processScroll);
      window.addEventListener('touchend', processScroll);
      window.addEventListener('touchmove', processScroll);
      setInterval(function() {
        processScroll();
      }, 1000)
    }

  }

  document.addEventListener('infiniteScroll-reload', init)
  document.addEventListener('reload', init)


  if (document.readyState === 'complete') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'complete') {
        init();
      }
    })
  }

}));
