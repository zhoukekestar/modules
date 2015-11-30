/* lazyload.js (c) Lorenzo Giuliani
 * MIT License (http://www.opensource.org/licenses/mit-license.html)
 *
 * expects a list of:
 * `<img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">`
 *
 * @see https://css-tricks.com/snippets/javascript/lazy-loading-images/
 *
 */

!( function( factory ) {
 if ( typeof define === "function" && define.amd ) {
   define(factory );
 } else {
   factory( );
 }
}(function( ){

  // All images.
  var images            = []
    , defaultImg        = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=='
    , backgroundImages  = [];

  function loadImage (el, fn) {
    var img = new Image()
      , src = el.getAttribute('data-src');
    img.onload = function() {
      el.src = src;
      fn? fn.call(el) : null;
    }
    img.src = src;
  }

  function loadBackgroundImage (el, fn) {
    var img = new Image()
      , src = el.getAttribute('data-backgroundimage');
    img.onload = function() {
      el.style.backgroundImage = 'url(' + src + ')';
      fn? fn.call(el) : null;
    }
    img.src = src;
  }

  function elementInViewport(el) {
    var rect = el.getBoundingClientRect()

    return (
       rect.top    >= 0
    && rect.left   >= 0
    && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    )
  }

  function processScroll() {

    for (var i = 0; i < images.length; i++) {
      if (!images[i].lazyloaded && elementInViewport(images[i]) ) {
        loadImage(images[i], function () {
          this.lazyloaded = true;
          this.classList.remove('lazy');
        });
      }
    };

    for (var i = 0; i < backgroundImages.length; i++) {
      if (!backgroundImages[i].lazyloaded && elementInViewport(backgroundImages[i]) ) {
        loadBackgroundImage(backgroundImages[i], function () {
          this.lazyloaded = true;
          this.classList.remove('lazy');
        });
      }
    };
  }

  var init = function(reload) {

    // For: <img class='lazy' data-src='http://abc.com'>
    images      = Array.prototype.slice.apply(document.querySelectorAll('img.lazy'))
    for (var i = 0; i < images.length; i++)
      images[i].src = images[i].src || defaultImg;

    // For: <img class='lazy delay' src='http://abc.com'>
    var imagesDelay = document.querySelectorAll('img.lazy.delay');
    for (var i = 0; i < imagesDelay.length; i++) {
      imagesDelay[i].setAttribute('data-src', imagesDelay[i].src)
      imagesDelay[i].src = defaultImg;
      images.push(imagesDelay[i])
    }

    // For: <div class='lazy' data-background-image=''>
    backgroundImages = Array.prototype.slice.apply(document.querySelectorAll('.lazy[data-backgroundimage]'))
    for (var i = 0; i < backgroundImages.length; i++)
      backgroundImages[i].style.backgroundImage = 'url(' + (backgroundImages[i].style.backgroundImage || defaultImg) + ')';

    processScroll();

    if (!reload)
      window.addEventListener('scroll',processScroll);

  }

  // For dynamic dom. When inerst html to dom.
  document.addEventListener('lazyload-reload', function() {
    init(true)
  })


  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

}));
