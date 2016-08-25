!(function(){
  var style = document.createElement('style');
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      height: 100%;
      width: 100%;
      position: fixed;
    }
    [data-role=view] {
      position: absolute;
      display: none;
      top: 0;
      height: 100%;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      transition: left .2s;
    }
  `;
  document.head.appendChild(style);

  var views = {}
    , eles = document.querySelectorAll('[data-role=view]')
    , currentIndex = 0;

  for (var i = 0; i < eles.length; i++) {
    eles[i].style.left = (100 * i) + '%';
    eles[i].style.display = 'block';
  }


  views.next = function() {

    currentIndex++;
    for (var i = 0; i < eles.length; i++) {
      eles[i].style.left = (100 * (i - currentIndex)) + '%';
    }

  }

  views.skipTo = function(index) {

    currentIndex = index;

    for (var i = 0; i < eles.length; i++) {
      eles[i].style.left = (100 * (i - currentIndex)) + '%';
    }
  }


  document.body.addEventListener('click', (e) => {
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
  })

  var a = () => {
    a = '';
  }
  window.VIEWS = views;

})();
