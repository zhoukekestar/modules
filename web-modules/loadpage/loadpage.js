!(function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(["alertMsg", "loadingPage" ], factory );
  } else {
    factory( jQuery );
  }
}(function($, loadingPage){

  if(!history.pushState) {

    $.fn.loadpage = function() { return this; };
    $.fn.loadpage.options = {};
    return;
  }

  if($.fn.loadpage) { return; }

  $.fn.loadpage = {};
  $.fn.loadpage.options = {
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

  var cache = [{url: location.href, doc: $('html').html()}];
  var options = $.fn.loadpage.options;
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
     * Load html by AJAX
     * @param  {string} url - url string
     * @param  {string} outAnimation - page hide animation
     * @param  {string} inAnimation  - page show animation
     */
    load: function(url, outAnimation, inAnimation, showAfterHide, isPoped) {

      if (options.beforeLoadPage() === false) return;
      try {
        // Change URL first, then you can get absolute url by location.href
        if (!isPoped)
          history.pushState({
            inAnimation: inAnimation,
            outAnimation: outAnimation,
            showAfterHide: showAfterHide
          }, '', url);
        url = location.href;
      } catch (e) {

      }

      outAnimation  = outAnimation === undefined ? options.outAnimation : outAnimation;
      inAnimation   = inAnimation  === undefined ? options.inAnimation  : inAnimation;
      showAfterHide = !!showAfterHide;

      var index   = url.indexOf('#');
      var pageid  = index === -1 ? "" : url.substr(index);
      var loaded = false;
      var afterLoaded = function(d) {
        // page is loaded.
        loaded = true;
        loadingPage.loaded();

        // Remove current pages & append to body. Bind hide animation.
        $(options.pageSelector)
          .addClass(options.animationClass + ' ' + outAnimation)
          .one(options.animationend, function(){

            // Remove old pages.
            $(this).remove();

            // Some hide element will not animate so that it can't be selected by $(this).
            // Remove it by outAnimation Class.
            $('.' + outAnimation).remove();

            // Show page after hide is enabled
            if (showAfterHide) {
              utils.showPage(d, pageid, url, inAnimation, isPoped)
            }
          });

        if (!showAfterHide) {
          utils.showPage(d, pageid, url, inAnimation, isPoped);
        }


      }

      // Show page is loading....
      // Only if the content can't loaded in 1 second will show the loading view.
      // If you show it every time even if it have fast internet, you just break his/her user experience (it feel so terrible).


      setTimeout(function(){
        if (loaded === false)
          loadingPage.loading();
      }, 1000);

      // Check cache.
      cache.forEach(function(obj) {
        // Change string like './demo1.html' to '/demo1.html'
        // After this, we can determine whether it's cached by function 'indexOf' simply.
        // var u = url.indexOf('.') === 0 ? url.substr(1) : url;
        // if (obj.url.indexOf(u) !== -1 && obj.url === u) {
        if (obj.url === url) {
          afterLoaded(obj.doc);
          return;
        }
      });
      // After loaded, variable loaded will be true.
      if (loaded === true)
        return;

      // Load page.
      $.ajax({
        url: url,
        success: function(d) {
          afterLoaded(d);
          var cached = false;
          cache.forEach(function(obj) {
            if (location.href === obj.url) {
              cached = true;
              return;
            }
          });
          if (cached === false) {
            cache.push({url: location.href, doc: d});
          }

          // If it greater than cache's size, remove the first page.
          if (cache.length > options.cachePages) {
            cache.shift();
          }

        },
        timeout: 20000,
        error: function(){

          // Oh, yes!! You can test it by visiting google on China just like this:
          // <a href="http://www.google.com" data-rel="page">demo2-error-google</a>
          // You can see it after 20 seconds. ~~~poor man.
          loaded = true;
          loadingPage.loaded();
          $.alertMsg('加载失败');
        }
      });
    },

    /**
     * Only execute by load function.
     */
    showPage: function (html, id, url, inAnimation, isPoped) {
      var pages = $(options.pageSelector, $(utils.htmlDoc(html)));
      var page = id === "" ? pages.first() : pages.filter(id);

      // Hide all pages before append to body.
      pages
        .hide()
        .addClass(options.pageClass)

      // TODO: append a single page is better???
      $('body').append(pages);

      // Show first page OR the special page
      page
        .show()
        .addClass(options.activeClass)
        .addClass(options.animationClass + ' ' + inAnimation)
        .one(options.animationend, function(a, b, c, d){
          $(this).removeClass(options.animationClass + ' ' + inAnimation);
          options.afterLoadPage();
        });


    }
  };

  // Show the first page. Hide others.
  $(options.pageSelector)
    .addClass(options.pageClass)
    .hide()
    .first().show().addClass(options.activeClass);

  // Dynamic bind a element's link click.
  $('body').delegate(options.linkSelector, 'click', function(e) {
    e.preventDefault();

    var url           = $(this).attr('href');
    var inAnimation   = $(this).data('transition-in');
    var outAnimation  = $(this).data('transition-out');
    var showAfterHide = $(this).data('show-after-hide');

    showAfterHide = showAfterHide === undefined ? false : true;
    utils.load(url, outAnimation, inAnimation, showAfterHide, false);

  });

  // Bind back button's click.
  $('body').delegate(options.backSelector, 'click', function(e) {
    e.preventDefault()
    history.back();
  });

  // Popup a history.
  window.onpopstate = function(e) {
      //console.log(e.state);
    window.scrollTo(0, 0);
    utils.load(location.href, "slideOutRight", "slideInLeft", false, true);
    window.scrollTo(0, 0)
  }

  return $.fn.loadpage.options;
}));
