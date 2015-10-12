!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  // Dependencies
  var toast = window.toast || window.alert,

      loadingPageLoading = function() {
        document.dispatchEvent(new Event('loadingPageLoading'));
      },

      loadingPageLoaded = function() {
        document.dispatchEvent(new Event('loadingPageLoaded'));
      },

      defaultOptions = {
        debug           : false,
        pageSelector    : '[data-role="page"]',
        activeClass     : 'active',
        pageClass       : 'page',

        // Cache pages' number.
        cachePages      : 5,

        animationClass  : 'animated',
        inAnimation     : 'slideInRight',
        outAnimation    : 'slideOutLeft',

        // Before/After load page, it will excute.
        beforeLoadPage  : function(){return true},
        afterLoadPage   : function(){return true}
      };


  var options           = defaultOptions,
      sessionStorage    = window.sessionStorage ? window.sessionStorage : {},
      inAnimation       = options.inAnimation;
      outAnimation      = options.outAnimation;

  var utils   = {

    /**
     * Convert a relative url to absolute url by `<a>` element (_linkEle).
     */
    _linkEle: null,
    toAbsoluteURL: function(url) {

      if (utils._linkEle === null) {
        utils._linkEle = document.createElement('a');
      }
      utils._linkEle.href = url;
      return utils._linkEle.href;
    },

    /**
     * @param  {[string]}  url      [The url you want to load]
     * @param  {Function}  callback [Callback function, it will return `null` when an error reported ]
     */
    loadByURL: function(url, callback) {

      url = utils.toAbsoluteURL(url);
      if (sessionStorage['cache_' + url]) {
        return callback(JSON.parse(sessionStorage['cache_' + url]));
      }

      // Show msg that page is loading.... please waiting...
      // Only if the content can't loaded in 1 second will show the loading view.
      // If you show it every time even if it have fast internet, you just break user experience (it will feels so terrible).
      var loaded = false;
      setTimeout(function(){
        if (loaded === false)
          loadingPageLoading();
      }, 2000);

      /**
       * AJAX request
       */
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open('GET', url, true);

      xmlHttp.timeout = 20000;
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {

          // Loaded
          loaded = true;
          loadingPageLoaded();

          /* success */
          if (xmlHttp.status >= 200 && xmlHttp.status < 300) {

            var data = {
              doc: xmlHttp.responseText,
              time: new Date().getTime()
            }
            // Cache it.
            sessionStorage['cache_' + url] = JSON.stringify(data)

            callback(data)

          /* error */
          } else {

            // Oh, yes!! You can test it by visiting google on China just like this:
            // <a href="http://www.google.com" data-rel="page">demo2-error-google</a>
            // You can see it after 20 seconds. ~~~poor man.
            toast('加载失败');
            callback(null);
          }
        }
      }
      xmlHttp.send();

    },

    oldPageEnd: function(e) {
      this.remove();

      this.removeEventListener('animationend', utils.oldPageEnd);
    },
    newPageEnd: function(e) {
      e.stopPropagation();
      this.classList.remove(options.animationClass);
      this.classList.remove(inAnimation)

      var scripts = [];
      // execute script
      Array.prototype.slice.apply(this.querySelectorAll('script')).forEach(function(script) {

        var src = script.getAttribute('src');
        var type = script.getAttribute('type') || 'text/javascript';

        if (type !== 'text/javascript') return;

        var temp = document.createElement('script');
        // for (var i =0, max = script.attributes.length; i < max; i++) {
        //   var attr = script.attributes[i];
        //   temp.setAttribute(attr.name, attr.value)
        // }

        if (src) {
          temp.src = src
        } else {
          temp.innerHTML = script.innerHTML;
        }
        scripts.push(temp);
        script.remove();
      })


      for (var i = 0, max = scripts.length; i < max; i++){
        this.appendChild(scripts[i])
      }


      options.afterLoadPage();

      this.removeEventListener('animationend', utils.newPageEnd)
    },

    /**
     * Show page by url
     * @param  {string} url - url string
     * @param  {bool}   pushState    - whether need pushState
     */
    showPage: function(url, pushState) {

      if (options.beforeLoadPage() === false) return;

      utils.loadByURL(url, function(data) {
        if (data === null) {
          return;
        }

        // Remove current pages & append to body. Bind hide animation.
        var oldPage = document.querySelector(options.pageSelector);
        oldPage.classList.add(options.animationClass);
        oldPage.classList.add(outAnimation);

        oldPage.addEventListener('animationend', utils.oldPageEnd);


        var html = document.createElement('div');
        html.innerHTML = data.doc;

        var newPage =  html.querySelector(options.pageSelector);

        newPage.classList.add(options.activeClass)
        newPage.classList.add(options.pageClass)
        newPage.classList.add(options.animationClass)
        newPage.classList.add(inAnimation)


        newPage.addEventListener('animationend', utils.newPageEnd);

        document.querySelector('html > body').appendChild(newPage);


        /* Reload module after get 'reload' event */
        document.dispatchEvent(new Event('reload'));

        // Save current animation & push state into history.
        if (pushState) {

          sessionStorage['animate_' + location.href] = JSON.stringify({
            inAnimation: inAnimation,
            outAnimation: outAnimation
          })
          history.pushState('', '', url);
        }

      })
    },


    /**
     * Reverse animate like:
     * bounceOutDown --> bounceInUp
     *
     */
    _reverseKey: [
      ['In', 'Out'],
      // ['Right', 'Left'],
      //['X', 'Y'],
      ['Down', 'Up']
    ],
    reverseAnimate: function(str) {

      var i = 0, max = utils._reverseKey.length;
      for(;i < max; i++) {
        var keys = utils._reverseKey[i];
        var reg = null;

        if (str.indexOf(keys[0]) !== -1) {
          reg = new RegExp(keys[0])
          str = str.replace(reg, keys[1])

        } else if (str.indexOf(keys[1]) !== -1) {
          reg = new RegExp(keys[1])
          str = str.replace(reg, keys[0])
        }
      }

      return str;
    }
  };

  // Init function
  var init = function() {

    // History && cache
    if(!history || !history.pushState) {

      if (options.debug) {
        alert('History.pushState is not supported on your browser. 您的游览器不支持history技术.')
      }
      defaultOptions = {};
      return;

    } else {

      // Cache loaded page when loaded.
      sessionStorage['cache_' + location.href] = JSON.stringify({
        doc: document.querySelector('html').outerHTML,
        time: new Date().getTime()
      })
      history.replaceState('', '', location.href);
    }

    // loaded
    loadingPageLoaded();


    // Page element init.
    // Add page-class & active class.
    var page = document.querySelector(options.pageSelector);
    page && page.classList.add(options.pageClass);
    page && page.classList.add(options.activeClass);


    // BIND
    document.addEventListener('click', function(e) {

      //
      for (var i = 0, max = e.path.length; i < max; i++) {
        var target = e.path[i];

        if (target === document.body) break;

        // Dynamic bind a element's link click.
        // Example: <a href='example.com' date-rel='page'>link to page</a>
        if (target && target.nodeName === 'A' && target.getAttribute('data-rel') === 'page') {

          e.preventDefault();

          var url       = target.getAttribute('href');
          inAnimation   = target.getAttribute('data-transition-in');
          inAnimation = inAnimation || options.inAnimation;

          outAnimation  = target.getAttribute('data-transition-out');
          outAnimation = outAnimation || options.outAnimation;

          utils.showPage(url, true);

        }
      }


      // Bind back button's click.
      // Just back.
      // Example: <a data-rel="back"></a>
      if (target.nodeName === 'A' && target.getAttribute('data-rel') === 'back') {
        e.preventDefault()
        history.back();
      }
    })

    // Popup a history.
    window.onpopstate = function(e) {

      if (e.state === null || e.state === undefined) {
        return ;
      }

      var animate = JSON.parse(sessionStorage['animate_' + location.href])

      // reverse animate
      inAnimation  = utils.reverseAnimate(animate.outAnimation);
      outAnimation = utils.reverseAnimate(animate.inAnimation);

      utils.showPage(location.href, false);
    }

  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

  return defaultOptions;

}));
