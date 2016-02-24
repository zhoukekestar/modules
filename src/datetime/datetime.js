!( function( factory ){
  if (typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  // var css = [
  //   '/_lib/bootstrap-datetimepicker/bootstrap.min.css',
  //   '/_lib/bootstrap-datetimepicker/bootstrap-datetimepicker.css'
  // ]
  // var js = [
  //   '/_lib/bootstrap-datetimepicker/jquery-2.1.1.min.js',
  //   '/_lib/bootstrap-datetimepicker/moment.min.js',
  //   '/_lib/bootstrap-datetimepicker/zh-cn.js',
  //   '/_lib/bootstrap-datetimepicker/bootstrap.min.js',
  //   '/_lib/bootstrap-datetimepicker/bootstrap-datetimepicker.js'
  // ]

  var css = [
    '//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css',
    '//cdn.bootcss.com/bootstrap-datetimepicker/4.17.37/css/bootstrap-datetimepicker.min.css'
  ]
  var js = [
    '//cdn.bootcss.com/jquery/2.2.0/jquery.min.js',
    '//cdn.bootcss.com/moment.js/2.11.1/moment.min.js',
    '//cdn.bootcss.com/moment.js/2.11.1/locale/zh-cn.js',
    '//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js',
    '//cdn.bootcss.com/bootstrap-datetimepicker/4.17.37/js/bootstrap-datetimepicker.min.js'
  ]

  // http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.woff

  var isBootstrapCSSLoaded = function() {

    var allCSS = document.querySelectorAll('link')
    for (var i = 0; i < allCSS.length; i++) {
      if (allCSS[i].href.indexOf('bootstrap.min.css') !== -1) {
        return true;
      }
    }
    return false;
  }
  css.forEach(function(href, index){

    // 避免重复加载bootstrap.css
    if (index === 0 && isBootstrapCSSLoaded()) {
      return;
    }
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href;
    document.head.appendChild(link);
  })

  var loadJS = function(i) {

    // 全部加载完成，并初始化控件
    if (i >= js.length) {
      init();
      return;
    }

    // 避免重复加载jquery
    if (i === 0 && window.jQuery) {
      loadJS(i + 1)
      return;
    }

    // 避免重复加载bootstrap
    if (i === 3 && (typeof $().modal == 'function')) {
      loadJS(i + 1);
      return;
    }

    var script = document.createElement('script')
    script.src = js[i];
    document.head.appendChild(script);
    script.onload = function() {
      // console.log(script.src + ' loaded.')
      loadJS(i + 1)
    }
  }


  var init = function() {

    if (!$.fn.datetimepicker) {
      console.error('Module[datetimepicker] failed to initialize.')
      return;
    }
    var inputs = document.querySelectorAll('input[type="datetime-local"],input[type="date"]');
    for (var i = 0;i < inputs.length; i++) {

      if (getComputedStyle(inputs[i].parentNode).position === 'static') {
        inputs[i].parentNode.style.position = 'relative';
      }

      if (inputs[i].type === 'datetime-local') {
        inputs[i].type = 'text';
        $(inputs[i]).datetimepicker({
          format: 'YYYY-MM-DD HH:mm'
        });
      } else {
        inputs[i].type = 'text';
        $(inputs[i]).datetimepicker({
          format: 'YYYY-MM-DD'
        });
      }
    }

  }

  if (document.readyState === 'complete') {
    loadJS(0)
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'complete') {
        loadJS(0)
      }
    })
  }
  return null;

}));
