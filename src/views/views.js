'use strict';

!function () {
  var style = document.createElement('style');
  style.innerHTML = '\n          html, body {\n            margin: 0;\n            padding: 0;\n            overflow: hidden;\n            height: 100%;\n            width: 100%;\n          }\n          [data-role=view] {\n            position: absolute;\n            display: none;\n            top: 0;\n            height: 100%;\n            width: 100%;\n            padding: 20px;\n            box-sizing: border-box;\n          }\n        ';
  document.head.appendChild(style);

  var views = document.querySelectorAll('[data-role=view]');
  var VIEWWIDTH = document.body.clientWidth;

  // init views
  for (var i = 0; i < views.length; i++) {
    views[i].style.left = 100 * i + '%';
    views[i].style.display = 'block';
  }

  setTimeout(function () {
    location.hash === '' ? document.body.scrollLeft = 0 : null;
  }, 0);

  var TIME = 300;
  var scrollTo = function scrollTo(targetLeft, callback) {

    var startT = Date.now(),
        left = document.body.scrollLeft,
        width = targetLeft - left;

    var interval = setInterval(function () {
      var now = Date.now(),
          t = now - startT;

      document.body.scrollLeft = left + width * t / TIME;
      if (t >= TIME) {
        document.body.scrollLeft = left + width;
        clearInterval(interval);
        callback && callback();
      }
    }, 16);
  };

  document.body.addEventListener('click', function (e) {
    if (e.target.dataset.href === 'view') {
      e.preventDefault();
      var ele = e.target.hash && document.querySelector(e.target.hash) || views[0];
      scrollTo(ele.offsetLeft, function () {
        location.href = e.target.href;
      });
    }
  });
}();
