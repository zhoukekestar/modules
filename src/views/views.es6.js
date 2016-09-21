!(function(){

  var ANIMATETIME = 0.2;

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
    body [data-role=view] {
      position: absolute;
      display: none;
      top: 0;
      height: 100%;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      transition: left ${ANIMATETIME}s;
    }
  `;
  document.head.appendChild(style);

  var CONTROL = {}
    , views = document.querySelectorAll('[data-role=view]')
    , defautView = location.hash && document.querySelector(location.hash + '[data-role=view]') || document.querySelector('[data-role=view][data-default=true]') || document.querySelector('[data-role=view]')
    , currentView = defautView
    , nextView = null
    , prevView = null
    , running = false;


  var overrideSetAttribute = function() {
    var _setAttribute = this.setAttribute;
    this.setAttribute = function(key, value) {

      if (key === 'data-prev' || key === 'data-next') {
        _setAttribute.call(this, key, value);
        if (key === 'data-next') {
          nextView.style.display = 'none';
        } else {
          prevView.style.display = 'none';
        }
        updatePreAndNextView();
      } else {
        _setAttribute.call(this, key, value);
      }
    }
  }

  /* Hide other views & Show default view. */
  for (var i = 0; i < views.length; i++) {
    views[i].style.left = 100 + '%';
    overrideSetAttribute.call(views[i])
  }

  defautView.style.left = 0;
  location.hash = '#' + currentView.id;

  var updatePreAndNextView = function() {
    for (var i = 0; i < views.length; i++) {
      if (views[i] === currentView) {

        // Get default next & prev view
        nextView = views[i + 1 >= views.length ? views.length - 1 : i + 1];
        prevView = views[i - 1 < 0 ? 0 : i - 1];

        // If element specify the next or prev view, get this view
        nextView = currentView.dataset.next && document.querySelector(currentView.dataset.next + '[data-role=view]') || nextView;
        prevView = currentView.dataset.prev && document.querySelector(currentView.dataset.prev + '[data-role=view]') || prevView;

        // Prepare next & prev views
        currentView != nextView ? (nextView.style.left = '100%') : null;
        currentView != prevView ? (prevView.style.left = '-100%') : null;

        currentView.style.display = 'block';
        nextView.style.display = 'block';
        prevView.style.display = 'block';

        running = false;
        return;
      }
    }
  }
  updatePreAndNextView();

  CONTROL.next = function() {

    if (running) {
      return;
    }
    running = true;

    setTimeout(function(){
      currentView != nextView ?  (currentView.style.left = '-100%', nextView.style.left = '0') : null;
    }, 1)

    setTimeout(function(){

      prevView.style.display = 'none';
      currentView.style.display = 'none';

      currentView = nextView;
      location.hash = '#' + currentView.id;
      updatePreAndNextView();
    }, ANIMATETIME * 1000)

  }

  CONTROL.prev = function() {

    if (running) {
      return;
    }
    running = true;

    setTimeout(function(){
      currentView != prevView ?  (currentView.style.left = '100%', prevView.style.left = '0') : null;
    }, 1)

    setTimeout(function(){

      nextView.style.display = 'none';
      currentView.style.display = 'none';

      currentView = prevView;
      location.hash = '#' + currentView.id;
      updatePreAndNextView();

    }, ANIMATETIME * 1000);
  }

  CONTROL.to = function(view) {

    var view = typeof view === 'string' ? document.querySelector(view) : view;

    if (currentView === view) return;

    /* is view placed before current view? */
    var beforeCurrentView = true;
    for (var i = 0; i < views.length; i++) {
      if (view === views[i]) {
        break;
      }
      if (currentView === views[i]) {
        beforeCurrentView = false;
      }
    }

    // Point to new view.
    if (beforeCurrentView) {

      // Hide prevView
      prevView.style.display = 'none';

      // Point to new view as prevView
      prevView = view;
      prevView.style.left = '-100%';
      setTimeout(function(){
        prevView.style.display = 'block';
        setTimeout(function(){
          CONTROL.prev();
        }, 100)
      }, 0)

    } else {

      nextView.style.display = 'none';

      nextView = view;
      nextView.style.left = '100%';
      setTimeout(function(){
        nextView.style.display = 'block';
        setTimeout(function(){
          CONTROL.next();
        }, 100)
      }, 0)

    }
  }

  window.addEventListener('hashchange', function() {
    if ('#' + currentView.id !== location.hash) {
      CONTROL.to(location.hash);
    }
  })


  CONTROL.prevView = prevView;
  CONTROL.nextView = nextView;
  CONTROL.currentView = currentView;
  CONTROL.updatePreAndNextView = updatePreAndNextView;
  window.VIEWSCONTROL = CONTROL;

})();
