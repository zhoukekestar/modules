!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var fn = function(html) {

    var code =  "var p = [], print = Array.prototype.push.bind(p); with(obj) { " +
      "p.push(`" +
      html
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments wrapped with <!--xxx-->
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments wrapped with /*xxx*/
        .replace(/\/\/.*?[\r\n]/g, '') // Remove comments wrapped with //

        .replace(/[\r\n]/g, "\v")
        .replace(/<%=(.*?)%>/g, function(a, b) {
          return "`); p.push(" + b.replace(/'/g, '`') + "); p.push(`";
        })
        .replace(/<%/g, "`);")
        .replace(/%>/g, "; p.push(`") +
      "`);}" +

        // Fix bug
      "return p.join(``);";

    code = code.replace(/'/g, "\\\'")
    code = code.replace(/`/g, "'");
    var fn = new Function('obj', code);
    return {
      fn: fn,
      code: code
    };
  }

  var showError = function(e) {
    try {

      var n = +e.stack.match(/<anonymous>:3:(\d*)\)/)[1];
      var code = this._code;
      code = code.substring(0, n) + '__ERROR__' + code.substring(n);
      code = code.replace("var p = [], print = Array.prototype.push.bind(p); with(obj) { p.push('", '')
                .replace("');}return p.join('');", '')
                .replace(/'\);\sp\.push\((.*?)\);\sp\.push\('/g, '<%=$1%>')
                .replace(/;\sp\.push\('/g, "%>")
                .replace(/'\);/g, "<%")

      code = code.replace(/\v/g, '\r\n')
      var index = code.indexOf('__ERROR__');
      var len = code.length;
      for (var i = index; i < len; i++) {
        if (code[i] === '\r' || code[i] === '\n') {
          index = i;
          break;
        }
      }

      code = code.substring(0, index) + '  ------------------------> ERROR' + code.substring(index);
      code = code.replace('__ERROR__', '');
      console.log(code)

    } catch (e) {
      console.log(e)
    }
  }

  var namespace = '_',
      updateBy = function(d) {
        try {
          var holder = this[namespace + 'holder'] || ( this.getAttribute('data-holder') && document.querySelector(this.getAttribute('data-holder')) );
          if (!holder) {
            console.log('Holder is empty.')
            return;
          }
          holder.innerHTML = this[namespace + 'fn'](d);

          // Trigger Event for webcom
          document.dispatchEvent(new Event('webcom-reload'));
        } catch (e) {
          console.log(e);
          showError.call(this, e);
        }
      },
      appendBy = function(d) {
        try {
          var holder = this[namespace + 'holder'] || ( this.getAttribute('data-holder') && document.querySelector(this.getAttribute('data-holder')) );
          if (!holder) {
            console.log('Holder is empty.')
            return;
          }

          var wrapper = this.getAttribute('data-wrapper');

          if (wrapper) {
            wrapper = document.createElement(wrapper)
            wrapper.innerHTML = this[namespace + 'fn'](d);
            while (wrapper.children.length > 0)
              holder.appendChild(wrapper.children[0])
          } else {
            holder.innerHTML += this[namespace + 'fn'](d);
          }

          // Trigger Event for webcom
          document.dispatchEvent(new Event('webcom-reload'));
        } catch (e) {
          console.log(e);
          showError.call(this, e);
        }
      },
      htmlBy = function(d) {
        try {
          return this[namespace + 'fn'](d);
        } catch (e) {
          console.log(e);
          showError.call(this, e)
        }
      };

  var init = function() {

    var i         = 0,
        eles      = document.querySelectorAll('[data-role="template"]'),
        max       = eles.length,
        ele;

    for (;i < max; i++) {
      ele = eles[i];

      if (ele[namespace + 'inited'] === undefined) {
        ele[namespace + 'inited'] = true;

        // Cache function code
        var fnRes = fn(ele.innerHTML);
        ele[namespace + 'fn'] = fnRes.fn;
        ele[namespace + 'code'] = fnRes.code;

        ele[namespace + 'updateBy'] = updateBy.bind(ele);
        ele[namespace + 'appendBy'] = appendBy.bind(ele);
        ele[namespace + 'htmlBy']   = htmlBy.bind(ele);
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

  document.addEventListener('reload', init)
  document.addEventListener('template-reload', init);
  document.addEventListener('template-reload-it', function(e) {

    if (e.target.getAttribute('data-role') === 'template') {
      e.target[namespace + 'inited'] = true;
      // Cache function code

      var fnRes = fn(e.target.innerHTML);
      e.target[namespace + 'fn'] = fnRes.fn;
      e.target[namespace + 'code'] = fnRes.code;

      e.target[namespace + 'updateBy'] = updateBy.bind(e.target);
      e.target[namespace + 'appendBy'] = appendBy.bind(e.target);
      e.target[namespace + 'htmlBy']   = htmlBy.bind(e.target);
    }
  })

  return null;
}));
