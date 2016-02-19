!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){
  var namespace = '_';
  var webComponentsCount = 0;

  var initWebComponent = function(ele) {

    // Init web component's template.
    var tmpl = ele.querySelector('[data-role="template"]');
    tmpl && tmpl.dispatchEvent(new Event('template-reload-it', {bubbles: true}));

    // Execute script
    var scripts = ele.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].type === '' || scripts[i].type === 'text/javascript') {
        var s = document.createElement('script');
        scripts[i].src ? (s.src = scripts[i].src) : (s.innerHTML = scripts[i].innerHTML);
        scripts[i].remove();
        ele.appendChild(s);
      }
    }

    // Export bind method on element.
    ele[namespace + 'bind'] = function(d) {
      try {
        tmpl._updateBy(d);
      } catch (e) {
        console.log(e)
      }
    }

    // Inited all web components.
    if (webComponentsCount == 0) {
      document.dispatchEvent(new Event('webcom-inited'));
    }
  }

  var init = function() {

    var i         = 0,
        eles      = document.querySelectorAll('[data-role="webcom"]'),
        max       = eles.length,
        ele;

    for (;i < max; i++) {
      ele = eles[i];

      if (ele[namespace + 'inited'] === undefined) {
        ele[namespace + 'inited'] = true;
        webComponentsCount++;

        // load html & init it.
        (function(ele){
          var url = ele.getAttribute('data-rel');
          if (!url) {
            webComponentsCount--;
            return;
          }

          var xmlHttp = new XMLHttpRequest()
          xmlHttp.open("GET", url, true);
          xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState === 4) {
              webComponentsCount--;

              if (xmlHttp.status !== 200) {
                console.log('request error');
                return;
              }

              try {
                ele.innerHTML = xmlHttp.responseText;
                initWebComponent(ele);
              } catch (e) {
                console.log(e)
              }
            }
          }
          xmlHttp.send(null);

        })(ele)
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
