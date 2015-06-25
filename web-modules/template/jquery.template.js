!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define([ "jquery" ], factory );
  } else {
    var init = factory( jQuery );
    init();
  }
}(function($){

  var tmpl = function(html, data) {
    //var html = document.getElementById(id).innerHTML;

    var code =  "var p = []; with(obj) { " +
      "p.push('" +
      html
        .replace(/[\r\n\t]/g, "")
        // Fix bug like: data-keyword='<%=JSON.stringify(obj)%>'
        // Because ' is key word in this string.
        .replace(/'/g, "\t")
        .replace(/<%=(.*?)%>/g, "'); p.push($1); p.push('")
        .replace(/<%/g, "');")
        .replace(/%>/g, "; p.push('") +
      "');}" +

        // Fix bug
      "return p.join('').replace(/\t/g, \"'\");";
    var fn = new Function('obj', code);
    var html;
    try {
      html = fn(data);
    } catch (e) {
      console.log(e.message);
      window.T = {};
      window.T.code = code
      window.T.fn = fn;
      window.T.data = data;

      html = ""
    }
    return html;
  }

  $.fn.template = function(options){
    var $this = $(this);

    // if data-holder is not set, Add a random div
    var id;
    if ($this.data('holder') === undefined) {
      id = new Date().getTime();
      id = 'holder_' + id;
      $('body').append('<div id="' + id + '"></div>');
    }
    options = $.extend({
      holder: $this.data('holder') === undefined ? '#' + id : $this.data('holder'),
      model: $this.data('model') === undefined ? {} : $this.data('model')
    }, options);

    $(options.holder).html(tmpl($this.html(), options.model));

    return {
      updateBy: function(d) {
        $(options.holder).html(tmpl($this.html(), d));
      },
      appendBy: function(d) {
        $(options.holder).append(tmpl($this.html(), d));
      }
    }
  }

  return $;
}));
