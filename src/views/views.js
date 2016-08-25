!function () {
  var style = document.createElement('style');
  style.innerHTML = '\n    html, body {\n      margin: 0;\n      padding: 0;\n      overflow: hidden;\n      height: 100%;\n      width: 100%;\n      position: fixed;\n    }\n    [data-role=view] {\n      position: absolute;\n      display: none;\n      top: 0;\n      height: 100%;\n      width: 100%;\n      padding: 20px;\n      box-sizing: border-box;\n      transition: left .2s;\n    }\n  ';
  document.head.appendChild(style);

  var views = {},
      eles = document.querySelectorAll('[data-role=view]'),
      currentIndex = 0;

  for (var i = 0; i < eles.length; i++) {
    eles[i].style.left = 100 * i + '%';
    eles[i].style.display = 'block';
  }

  views.next = function () {

    currentIndex++;
    for (var i = 0; i < eles.length; i++) {
      eles[i].style.left = 100 * (i - currentIndex) + '%';
    }
  };

  views.skipTo = function (index) {

    currentIndex = index;

    for (var i = 0; i < eles.length; i++) {
      eles[i].style.left = 100 * (i - currentIndex) + '%';
    }
  };

  document.body.addEventListener('click', function (e) {
    if (e.target.dataset.href === 'view') {
      e.preventDefault();
      var ele = e.target.hash && document.querySelector(e.target.hash) || eles[0];

      for (var i = 0; i < eles.length; i++) {
        if (ele === eles[i]) {
          views.skipTo(i);
          break;
        }
      }
    }
  });

  window.VIEWS = views;
}();
