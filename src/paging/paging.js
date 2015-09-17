
;(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    factory();
  }
}(function() {

  var paging = function(ele, o) {

    var self = typeof ele === 'string' ? document.querySelector(ele) : ele;
    var options = {
      total: 1,
      pagesize: 10,
      current: 1,
      showitem: 5, // if showitem is 6, it will show 7 items.
      debug: false,
      onselect: function() {}
    };

    // Extend
    for (var key in o) options[key] = o[key];

    (typeof options.total === "string") && (options.total = parseInt(options.total));
    (typeof options.current === "string") && (options.current = parseInt(options.current));


    var buildPaging = function() {
      var
        totalPage = Math.ceil(options.total / options.pagesize),
        halfitem  = Math.floor(options.showitem / 2),
        startPage = (options.current - halfitem) > 1 ? (options.current - halfitem) : 1,
        endPage   = (options.current + halfitem) > totalPage ? totalPage : (options.current + halfitem),
        html      = "",
        pre       = (options.current - 1) > 1 ? (options.current - 1) : 1,
        next      = (options.current + 1) > totalPage ? totalPage : (options.current + 1);


      if (startPage === 1) {
        totalPage > (startPage + options.showitem) ? (endPage = startPage + options.showitem - 1) : (endPage = totalPage);
      }

      if (endPage === totalPage) {
        (totalPage - options.showitem) <= 0 ? (startPage = 1) : (startPage = totalPage - options.showitem + 1);
      }

      if (startPage <= endPage) {

        html += "<ul>"
        html += "<li class='first-child' data-num='1'>&lt;&lt;</li><li data-num='" + pre + "'>&lt;</li>";
        for (var i = startPage; i <= endPage; i = i + 1) {
          if (i === options.current)
            html += "<li class='active' data-num='" + i + "'>" + i + "</li>";
          else
            html += "<li data-num='" + i + "'>" + i + "</li>";
        }
        html += "<li data-num='" + next + "'>&gt;</li><li class='last-child' data-num='" + totalPage + "'>&gt;&gt;</li>";
        html += "</ul>";

      }

      // Replace html.
      self.innerHTML = html;

      // Disabled some element if its equal current pagenum.
      var lis = self.querySelectorAll('li');
      for (var i = 0, max = lis.length; i < max; i++) {
        if (+lis[i].getAttribute('data-num') === options.current) {
          lis[i].classList.add('disabled');
        }
      }
    }


    // Bind click for each li element.
    self.addEventListener('click', function(e) {

      var num = +e.target.getAttribute('data-num')
      if (num !== options.current)
        options.onselect(num);

    })

    // Init paging
    buildPaging();

    return {
      select: function(n) {
        options.current = n;
        buildPaging();
      },
      reBuild: function(total, cur) {
        options.total = total;
        options.current = cur;
        buildPaging();
      }
    }
  }


  var init = function() {

    var namespace = '_';
    var ele = document.querySelector('[data-role="paging"]');
    if (ele[namespace + 'inited'] === undefined ) {

      ele[namespace + 'inited'] = true;

      var elep = paging(ele, {
        current : +ele.getAttribute('data-current'),
        onselect: function(n){

          (typeof ele['onselect'] === 'function') && ele['onselect'](n);

        },
        total   : +ele.getAttribute('data-total'),
        pagesize: +ele.getAttribute('data-pagesize')
      })

      ele[namespace + 'select'] = elep.select;
      ele[namespace + 'reBuild'] = elep.reBuild;
    }

  };


  document.addEventListener('readystatechange', function(e) {
    if (document.readyState === 'interactive') {
      init();
    }
  })
  document.addEventListener('reload', init)

  return null;
}));
