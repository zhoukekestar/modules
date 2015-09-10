!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(factory );
  } else {
    factory( );
  }
}(function( ){

  // Code form Zepto.js
  // @see https://github.com/madrobby/zepto/blob/master/src/form.js#files
  var serializeArray = function() {
    var name, type, result = [],
        add = function(value) {
          if (value.forEach) return value.forEach(add)
          result.push({ name: name, value: value })
        };

    [].slice.apply(this.elements).forEach(function(field) {

      type = field.type, name = field.name
      if (name && field.nodeName.toLowerCase() !== 'fieldset' &&
        !field.disabled && type !== 'submit' && type !== 'reset' && type !== 'button' && type !== 'file' &&
        ((type !== 'radio' && type !== 'checkbox') || field.checked))
          add(field.value)
    })
    return result
  }

  var serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
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
  //
  var submitHandler = function(e, options, action) {
    e.preventDefault();

    var self = this;
    var method = self.getAttribute('method') || 'POST';
    var res;

    if (method === "GET") {
      res = serialize.call(self);
    } else {

      res = {};
      serializeArray.call(self).forEach(function(t){
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

          value = +value;

        } else if (type === 'time') {
          value = new Date(value).getTime();

        } else if (type === 'bool') {
          if (value === 'false')
            value = false
          else
            value = !!value;

        }

        deepSet(res, keys, value);
      });

      res = options.data(res);
      res = JSON.stringify(res);
    }

    /**
     * If there are no data should be sent, just return.
     */
    if (res === 'null') {
      return;
    }


    var xmlHttp = new XMLHttpRequest();
    /**
     * Add session header for cross-domain request.
     * You can't set cookies for ajax
     * and you have to response #options request# like:
     * "Access-Control-Allow-Headers: X-AVOSCloud-Session-Token"
     * before you send it.
     * */
    var session = document.cookie.match(/sessionToken=([^;]*)(;|$)/);
    xmlHttp.open(method, action === undefined ? self.getAttribute('action') : action, true);

    if (session) {
      xmlHttp.setRequestHeader('X-AVOSCloud-Session-Token', session[1])
    }
    xmlHttp.responseType = 'json';
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
          options.ended(xmlHttp.response, xmlHttp)
        } else {
          options.error(xmlHttp);
        }
      }
    }
    xmlHttp.send(res);
  }


  /**
   * Set obj's value by keys
   * @param  {[object]}           obj   The target you want to set.
   * @param  {[array]}            keys  The value's path.
   * @param  {[string, array...]} value Target's value.
   * @return {[object]}                 The target after setting value.
   *
   * Example: obj = {'a':'a'}, keys = ['b','bb'], value = 'b-value'
   * return {
   *         'a': 'a',
   *         'b': {
   *           'bb': 'b-value'
   *          }
   *        }
   */
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

  /**
   * Example:
   * <form action='/action/a'>
   * <input type='submit'>
   * <input type='submit' formAction='/action/b'>
   * </form>
   */
  var formAction;
  document.addEventListener('click', function(e) {
    var target = e.target;

    if (target.type === 'submit' && target.formAction) {
      formAction = target.formAction;
    }

    setTimeout(function() {
      formAction = undefined;
    }, 1000);

  })

  /**
   * Submit form's handler.
   * Example:
   * <form data-role='formJSON'>
   * </form>
   */
  document.addEventListener('submit', function(e) {

    var target = e.target;

    if (target.getAttribute('data-role') === 'formJSON') {

      var options = {
        ended: target.onended || function(){},
        // to change data
        data: target._data || function(d){return d},
        error: target.onerror || function(){}
      };

      submitHandler.call(target, e, options, formAction);
    }

  })


  return null;
}));
