!(function(){
  var style = document.createElement('style');
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
    [data-role=view] {
      position: absolute;
      display: none;
      top: 0;
      height: 100%;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(style);

  var views = document.querySelectorAll('[data-role=view]');
  var VIEWWIDTH = document.body.clientWidth;

  // init views
  for (var i = 0; i < views.length; i++) {
    views[i].style.left = (100 * i) + '%';
    views[i].style.display = 'block';
  }

  setTimeout(() => {
    location.hash === '' ? document.body.scrollLeft = 0 : null;
  }, 0);

  var TIME = 300;
  var scrollTo = (targetLeft, callback) => {

    var startT = Date.now()
      , left = document.body.scrollLeft
      , width = targetLeft - left;

    var interval =  setInterval( () => {
      var now = Date.now()
        , t = now - startT;

      document.body.scrollLeft = left + width * t / TIME;
      if (t >= TIME) {
        document.body.scrollLeft = left + width;
        clearInterval(interval);
        callback && callback();
      }
    }, 16);

  }

  document.body.addEventListener('click', (e) => {
    if (e.target.dataset.href === 'view') {
      e.preventDefault();
      var ele = e.target.hash && document.querySelector(e.target.hash) || views[0];
      scrollTo(ele.offsetLeft, () => {
        location.href = e.target.href;
      });
    }
  })

})();
