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
  var images = [];
  function loadImage (el, fn) {
    var img = new Image()
      , src = el.getAttribute('data-src');
    img.onload = function() {
      if (!! el.parent)
        el.parent.replaceChild(img, el)
      else
        el.src = src;

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
        });
      }
    };
  }

  var init = function() {

    images = document.querySelectorAll('img.lazy')

    for (var i = 0; i < images.length; i++)
      images[i].src = images[i].src || "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";

    processScroll();
    window.addEventListener('scroll',processScroll);

  }

  // For dynamic dom. When inerst html to dom.
  document.addEventListener('lazyload-reload', function() {
    images = document.querySelectorAll('img.lazy');

    for (var i = 0; i < images.length; i++)
      images[i].src = images[i].src || "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==";

    processScroll();
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
