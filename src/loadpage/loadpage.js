!(function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(["jquery", "loadingPage", "alertMsg" ], factory );
  } else {
    factory( jQuery );
  }
}(function($, loadingPage){

  if($.fn.loadpage) { return; }

  $.fn.loadpage = {};
  $.fn.loadpage.options = {
    debug           : false,
    pageSelector    : '[data-role="page"]',
    linkSelector    : 'a[data-rel="page"]',
    backSelector    : 'a[data-rel="back"]',
    activeClass     : 'active',
    pageClass       : 'page',

    // Cache pages' number.
    cachePages      : 5,

    animationClass  : 'animated',
    animationstart  : "animationstart webkitAnimationStart oanimationstart MSAnimationStart",
    animationend    : "animationend webkitAnimationEnd oanimationend MSAnimationEnd",
    inAnimation     : 'slideInRight',
    outAnimation    : 'slideOutLeft',

    // Before/After load page, it will excute.
    beforeLoadPage  : function(){return true},
    afterLoadPage   : function(){return true}
  };


  var cache                 = [{url: location.href, doc: $('html').html()}],
      options               = $.fn.loadpage.options,
      sessionStorage        = {},//window.sessionStorage ? window.sessionStorage : {},
      previousHistoryState  = null;


  if(!history || !history.pushState) {
    if (options.debug) {
      alert('History.pushState is not supported on your browser. 您的游览器不支持history技术.')
    }
    $.fn.loadpage = function() { return this; };
    $.fn.loadpage.options = {};
    return;

  } else {

    history.replaceState('', '', location.href);
  }


  /**
   * htmlDoc Covert html to document
   * load    Load page by given url.
   * showPage Show html in current document, by givent animation.
   *
   */
  var utils   = {

    /**
     * Prevents jQuery from stripping elements from $(html)
     * @param   {string}    url - url being evaluated
     * @author  Ben Alman   http://benalman.com/
     * @see     https://gist.github.com/cowboy/742952
     *
     */
    htmlDoc: function (html) {
      var parent,
          elems       = $(),
          matchTag    = /<(\/?)(html|head|body|title|base|meta)(\s+[^>]*)?>/ig,
          prefix      = "ss" + Math.round(Math.random() * 100000),
          htmlParsed  = html.replace(matchTag, function(tag, slash, name, attrs) {
              var obj = {};
              if (!slash) {
                  $.merge(elems, $("<" + name + "/>"));
                  if (attrs) {
                      $.each($("<div" + attrs + "/>")[0].attributes, function(i, attr) {
                          obj[attr.name] = attr.value;
                      });
                  }
                  elems.eq(-1).attr(obj);
              }
              return "<" + slash + "div" + (slash ? "" : " id='" + prefix + (elems.length - 1) + "'") + ">";
          });

      // If no placeholder elements were necessary, just return normal
      // jQuery-parsed HTML.
      if (!elems.length) {
          return $(html);
      }
      // Create parent node if it hasn't been created yet.
      if (!parent) {
          parent = $("<div/>");
      }
      // Create the parent node and append the parsed, place-held HTML.
      parent.html(htmlParsed);

      // Replace each placeholder element with its intended element.
      $.each(elems, function(i) {
          var elem = parent.find("#" + prefix + i).before(elems[i]);
          elems.eq(i).html(elem.contents());
          elem.remove();
      });

      return parent.children().unwrap();
    },


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
          loadingPage.loading();
      }, 1000);

      // Load page.
      $.ajax({
        url: url,
        success: function(d) {

          // Loaded
          loaded = true;
          loadingPage.loaded();

          var data = {
            doc: d,
            time: new Date().getTime()
          }
          // Cache it.
          sessionStorage['cache_' + url] = JSON.stringify(data)


          callback(data)
        },
        timeout: 20000,
        error: function(){

          // Loaded
          loaded = true;
          loadingPage.loaded();

          // Oh, yes!! You can test it by visiting google on China just like this:
          // <a href="http://www.google.com" data-rel="page">demo2-error-google</a>
          // You can see it after 20 seconds. ~~~poor man.
          $.alertMsg('加载失败');
          callback(null);
        }
      });

    },
    /**
     * Show page by url
     * @param  {string} url - url string
     * @param  {string} outAnimation - page hide animation
     * @param  {string} inAnimation  - page show animation
     * @param  {bool}   pushState    - whether need pushState
     */
    showPage: function(url, outAnimation, inAnimation, pushState) {

      if (options.beforeLoadPage() === false) return;

      outAnimation  = !outAnimation ? options.outAnimation : outAnimation;
      inAnimation   = !inAnimation  ? options.inAnimation  : inAnimation;


      utils.loadByURL(url, function(data) {
        if (data === null) {
          return;
        }

        // Remove current pages & append to body. Bind hide animation.
        $(options.pageSelector)
          .addClass(options.animationClass + ' ' + outAnimation)
          .one(options.animationend, function(){

            // Remove old pages.
            $(this).remove();

            // Some hide element will not animate so that it can't be selected by $(this).
            // Remove it by outAnimation Class.
            $('.' + outAnimation).remove();

          });


        var $html = $(utils.htmlDoc(data.doc));
        var page;

        // Fix bug if html's root element is #data-role='page'#
        if ($html.data('role') === 'page') {
          page = $html;
        } else {
          page = $(options.pageSelector, $html).first();
        }

        // Hide page before append to body.
        page
          .hide()
          .addClass(options.pageClass)


        $('body').append(page);

        // Show first page OR the special page
        page
          .show()
          .addClass(options.activeClass)
          .addClass(options.animationClass + ' ' + inAnimation)
          .one(options.animationend, function(){
            $(this).removeClass(options.animationClass + ' ' + inAnimation);
            options.afterLoadPage();
          });


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
      //['Right', 'Left'],
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
  (function() {

    // Show the first page. Hide others.
    try {
      var firstPage = $(options.pageSelector).addClass(options.pageClass).first();
      $(options.pageSelector).not(firstPage).hide();
      firstPage.show().addClass(options.activeClass);
    } catch (e) {
      if (options.debug) {
        alert(e.message)
      }
    }
    // Dynamic bind a element's link click.
    $('body').delegate(options.linkSelector, 'click', function(e) {
      e.preventDefault();
      try {
        var url = $(this).attr('href');
        var inAnimation = $(this).data('transition-in');
        var outAnimation = $(this).data('transition-out');

        utils.showPage(url, outAnimation, inAnimation, true);

      } catch (e) {
        if (options.debug) {
          alert(e.message);
        }
      }

    });

    // Bind back button's click.
    $('body').delegate(options.backSelector, 'click', function(e) {
      e.preventDefault()
      history.back();
    });



    // Popup a history.
    window.onpopstate = function(e) {

      if (options.debug) {
        alert(JSON.stringify(e.state))
        alert('back active.')
      }

      if (e.state === null || e.state === undefined) {
        return;
      }

      var animate = JSON.parse(sessionStorage['animate_' + location.href])

      // reverse animate
      animate.outAnimation = utils.reverseAnimate(animate.outAnimation);
      animate.inAnimation = utils.reverseAnimate(animate.inAnimation);

      try {

        // reverse in & out
        utils.showPage(location.href, animate.inAnimation, animate.outAnimation, false);
      } catch (e) {
        if (options.debug) {
          alert(e.message)
        }
      }
    }

  })();

  return $.fn.loadpage.options;
}));
