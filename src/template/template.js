!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var fn = function(html) {
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

    // try {
    //   html = fn(data);
    // } catch (e) {
    //   console.log(e.message);
      // window.T = {};
      // window.T.code = code
      // window.T.fn = fn;
      // window.T.data = data;

    //   html = ""
    // }
    return fn;
  }

  var namespace = '_',
      updateBy = function(d) {
        try {
          var holder = this.getAttribute('data-holder');
          if (!holder) {
            console.log('Holder is empty.')
            return;
          }
          holder = document.querySelector(holder)
          if (!holder) {
            console.log("Can't select " + holder);
            return;
          }
          holder.innerHTML = this[namespace + 'fn'](d);
        } catch (e) {
          console.log(e);
        }
      },
      appendBy = function(d) {
        try {
          var holder = this.getAttribute('data-holder');
          if (!holder) {
            console.log('Holder is empty.')
            return;
          }
          holder = document.querySelector(holder)
          if (!holder) {
            console.log("Can't select " + holder);
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

        } catch (e) {
          console.log(e);
        }
      },
      htmlBy = function(d) {
        try {
          return this[namespace + 'fn'](d);
        } catch (e) {
          console.log(e);
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
        ele[namespace + 'fn'] = fn(ele.innerHTML);

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

  return null;
}));
