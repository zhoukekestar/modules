!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define([ "jquery" ], factory );
  } else {
    var init = factory( jQuery );
    init();
  }
}(function($){

  var submitHandler = function(e, $this, options, action) {
    e.preventDefault();

    // Default method is POST
    var method = $this.attr('method');
    if (method === undefined)
      method = "POST"

    var res;

    if (method === "GET") {
      res = $this.serialize();
    } else {

      res = {};
      $this.serializeArray().forEach(function(t){
        var keys  = t.name.split('.');
        var len   = keys.length - 1;
        var index = keys[len].indexOf(':');
        var value = t.value;
        var type;
        if (index !== -1) {
          type    = keys[len].substr(index + 1);
          keys[len] = keys[len].substr(0, index);
        } else {
          type = 'string';
        }

        if (type === 'array' || type === 'object') {

          value  = JSON.parse(value);

        } else if (type === 'number') {
          value = Number.parseFloat(value)

        } else if (type === 'bool') {
          if (value === 'false')
            value = false
          else
          value = !!value;

        }

        deepSet(res, keys, value);
      });

      // Debug the result
      options.debug(res);
      res = JSON.stringify(res);
    }



    /**
     * Add session header for cross-domain request.
     * You can't set cookies for ajax
     * and you have to response #options request# like:
     * "Access-Control-Allow-Headers: X-AVOSCloud-Session-Token"
     * before you send it.
    * */
    var session = document.cookie.match(/sessionToken=([^;]*)(;|$)/);
    if (session) {
      session = {
        "X-AVOSCloud-Session-Token": session[1]
      }
    }
    $.ajax({
      type: method,
      headers:session,
      contentType: "application/json",
      url: action === undefined ? $this.attr('action') : action,
      data: res,
      success: function(d) {
        options.success(d, $this);
      },
      error: options.error
    });
  }
  // keys: ["a", ""]
  // ["a", "b", "c"], ["a", "b", "d"]
  // types: "string", "array", "number", "bool", "object"
  //
  // TEST
  // form.json
  // input(name='a')
  // input(name='images.')
  // input(name='images.')
  // input(name='b.b')
  // input(name='c.c.:number')
  // input(name='c.c.')
  // input(type='submit')
  var deepSet = function(obj, keys, value) {

    var curKey = keys[0];
    if(keys.length === 1) {

      curKey === '' ? obj.push(value) : obj[curKey] = value;

      return;
    }
    if (keys.length > 1) {
      if (typeof obj[curKey] === 'undefined')
        obj[curKey] = keys[1] === '' ? [] : {};
    }

    var o = obj[curKey];
    keys.shift();
    return deepSet(o, keys, value);
  }

  $.fn.formJSON = function(o){

    var options = $.extend({
      delegate: false,
      debug: function(){},
      success: function(){},
      error: function(){}
    }, o);


    // each element's bind
    $(this).each(function(){


      // simple submit & click event
      if (options.delegate === false) {

        $(this).submit(function (e) {
          submitHandler(e, $(this), options);
        });
      // delegate event
      } else {

        $(this).delegate(options.delegate, 'submit', function (e) {
          submitHandler(e, $(this), options);
        });
      }

      $(this).find('input[type="submit"]').click(function (e) {
        submitHandler(e, $(this).parents('form'), options, $(this).attr('formaction'));
      })


    }); // each
  }
  return $;
}));
