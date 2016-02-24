!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){
  var debug                 = false
    , namespace             = '_'
    , webComponentsCount    = 0
    , customElementsLoaded  = {}
    , webcomInited          = false;

  window.customElements = {};

  var initCustomElement = function(role) {

    debug && console.log('init customElement :' + role);

    // Inited flag.
    if (customElementsLoaded[role]) return;
    customElementsLoaded[role] = true;

    var customElement = customElements[role];

    if (!customElement) {
      console.log('customElement ' + role + ' not Found.')
      return;
    }
    document.body.appendChild(customElement);
    customElement.style.display = 'none';

    // Init web component's template.
    var tmpl = customElement.querySelector('[data-role="template"]');
    tmpl && tmpl.dispatchEvent(new Event('template-reload-it', {bubbles: true}));

    // Execute script
    var scripts = customElement.querySelectorAll('script');
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i].type === '' || scripts[i].type === 'text/javascript') {

        // Skip the script only executed after template is updated.
        if (scripts[i].getAttribute('data-run') === 'template-updated') {
          continue;
        }

        // Execute the normal script.
        var s = document.createElement('script');
        s.setAttribute('data-runner', 'this-script-executed-by-webcom')
        scripts[i].src ? (s.src = scripts[i].src) : (s.innerHTML = scripts[i].innerHTML);
        scripts[i].remove();
        customElement.appendChild(s);
      }
    }
  }

  var initWebComponents = function() {
    debug && console.log('initWebComponents...')
    var eles = document.querySelectorAll('[data-is]');
    for (var i = 0; i < eles.length; i++) {

      // Inited flag.
      if (eles[i][namespace + 'inited']) continue;
      eles[i][namespace + 'inited'] = true;

      // Get its role.
      var role = eles[i].getAttribute('data-is');
      customElementsLoaded[role] ? 1: initCustomElement(role);

      // Bind function for template.
      eles[i].setAttribute = function(name, value) {

        if (name === 'data-bind') {
          try {

            var tmpl = customElements[role].querySelector('[data-role="template"]');
            tmpl[namespace + 'holder'] = this;
            tmpl[namespace + 'updateBy'](JSON.parse(value));

            // Execute template-updated script.
            var scripts = customElements[role].querySelectorAll('script[data-run="template-updated"]');
            for (var j = 0; j < scripts.length; j++) {
              var s = document.createElement('script');
              s.setAttribute('data-runner', 'this-script-executed-by-webcom');
              s.setAttribute('data-run', 'template-updated-by-webcom');

              // export current var to global
              var tempName = '_webcom' + Date.now() + (Math.random() + '').substr(2, 6);
              window[tempName] = this;

              // Execute it with current this.
              s.innerHTML = '(function(){' + scripts[j].innerHTML + '}).bind(window["' + tempName + '"])();'

              // execute it.
              this.appendChild(s);

              // Clear var.
              setTimeout(function(){
                delete window[tempName];
              }, 1000)
            }
          } catch (e) {
            console.log(e)
          }
        }

        Element.prototype.setAttribute.call(this, name, value);
      }
      if (eles[i].getAttribute('data-bind')) {
        eles[i].setAttribute('data-bind', eles[i].getAttribute('data-bind'));
      }

      // Execute _loaded function.
      ;(typeof eles[i][namespace + 'loaded'] === 'function') && eles[i][namespace + 'loaded']();


      // Clone html to instance except CSS & JS.
      if (!customElements[role]) {
        console.log('customElement ' + role + ' not Found.')
        return;
      }
      var children = customElements[role].children;
      for (var j = 0; j < children.length; j++) {
        if (children[j].nodeName !== 'SCRIPT' && children[j].nodeName !== 'STYLE' && children[j].nodeName !== 'LINK')
          eles[i].appendChild(children[j].cloneNode(true))
      }
    }

    // Trigger webcom-inited event on document.
    ;(webcomInited === false) && document.dispatchEvent(new Event('webcom-inited')) && (webcomInited = true);
  }

  var init = function() {

    var i         = 0,
        links     = document.querySelectorAll('link[rel="import-webcom"]'),
        link;

    for (;i < links.length; i++) {
      link = links[i];

      // Inited flag
      if (link[namespace + 'inited']) continue;
      link[namespace + 'inited'] = true;

      webComponentsCount++;

      // load html & init it.
      (function(link){

        var url = link.href;
        // No extern html should be loaded.
        if (!url) {
          webComponentsCount--;
          // All links is loaded.
          if (webComponentsCount === 0) {
            initWebComponents();
          }
          return;
        }

        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", url, true);
        xmlHttp.onreadystatechange = function(){

          // Extern html is loaded
          if (xmlHttp.readyState === 4) {

            if (xmlHttp.status !== 200) {
              console.log('request error');
            } else {
              try {
                var doc = document.createDocumentFragment();
                var wrapper = document.createElement("div");
                wrapper.innerHTML = xmlHttp.responseText;
                doc.appendChild(wrapper);
                link[namespace + 'doc'] = doc;

                // Mount all "data-register" element to customElements.
                var eles = doc.querySelectorAll('[data-register]');
                for (var j = 0; j < eles.length; j++) {
                  var register = eles[j].getAttribute('data-register');
                  customElements[register] = eles[j];
                }

              } catch (e) {
                console.log(e)
              }
            }

            webComponentsCount--;
            // All links is loaded.
            if (webComponentsCount === 0) {
              initWebComponents();
            }
          }
        }
        xmlHttp.send(null);

      })(link)

    }

    // All links is loaded.
    if (webComponentsCount === 0) {
      initWebComponents();
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

  document.addEventListener('webcom-reload', init);
  document.addEventListener('reload', init)

  return null;
}));
