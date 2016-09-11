!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  window.customElements = window.customElements || {};

  var debug                 = false
    , namespace             = '_'
    , webComponentLinks     = 0
    , webComponentsCount    = 0
    , customElementsLoaded  = {}
    , webcomInited          = false
    , running               = false;

  // Override setAttribute function.
  var setAttributeFun = function(name, value) {

    var currentRole = this.getAttribute('data-is')
      , self = this;

    if (name === 'data-bind') {

      this._dataBind = value;

      // Hide data-bind
      if (this.getAttribute('data-bind-show') === 'true') {
        Element.prototype.setAttribute.call(this, name, value);
      } else {
        Element.prototype.setAttribute.call(this, name, 'data-was-hidden-by-webcom');
      }

      // run template
      try {

        this.classList.add(currentRole);

        var tmpl = customElements[currentRole].querySelector('[data-role="template"]');
        if (!tmpl) {
          console.warn('Attribute named data-bind is not affected as template is null.')
          return;
        }
        tmpl[namespace + 'holder'] = this;
        tmpl[namespace + 'updateBy'](JSON.parse(value));

        ;(typeof this[namespace + 'updated'] === 'function') && this[namespace + 'updated']();

        // Execute template-updated script.

        // export current var to global
        var tempName = '_webcom' + Date.now() + (Math.random() + '').substr(2, 6);
        window[tempName] = this;

        var scripts = customElements[currentRole].querySelectorAll('script[data-run="template-updated"]');
        for (var j = 0; j < scripts.length; j++) {

          var s = document.createElement('script');
          s.setAttribute('data-runner', 'this-script-executed-by-webcom');
          s.setAttribute('data-run', 'template-updated-by-webcom');

          // Execute it with current this.
          s.innerHTML = '(function(webcom){' + scripts[j].innerHTML + '}).bind(window["' + tempName + '"])(window["' + tempName + '"]); //# sourceURL=' + currentRole + '-template-updated.js'

          // execute it.
          this.appendChild(s);

        }

        // Clear var.
        setTimeout(function(){

          delete window[tempName];

          // The appended child (html) may include customElement, so, you should reload it again.
          if (self.querySelector('[data-is]')) {
            debug && console.log('dispatchEvent: webcom-reload.')
            document.dispatchEvent(new Event('webcom-reload'));
          }

        }, 1000)

      } catch (e) {
        console.warn("Webcom can't update template successfully. Please check the data-bind value.")
        console.log(e)
      }

    } else {
      Element.prototype.setAttribute.call(this, name, value);
    }
  }

  /*
  *  Init custom Element
  *  1: add to custom element to document.body so that style & links can be effective.
  *  1: init template
  *  2: run scripts (except "template-updated" scripts)
  */
  var initCustomElement = function(ele, callback) {

    var role = ele.dataset.is;

    if (customElementsLoaded[role]) {
      return callback(ele);
    }

    debug && console.log('init customElement :' + role);

    // Inited flag.
    if (customElementsLoaded[role]) return;
    customElementsLoaded[role] = true;

    var customElement   = customElements[role]
      , tmplsInitCount  = 0
      , tmpls
      , scripts;

    if (!customElement) {

      console.log('customElement ' + role + ' not Found.')
      return callback();
    }

    tmpls   = customElement.querySelectorAll('[data-role="template"]')
    scripts = customElement.querySelectorAll('script');

    document.body.appendChild(customElement);
    customElement.style.display = 'none';

    // Execute script
    var executeScript = function() {

      for (var i = 0; i < scripts.length; i++) {

        if (scripts[i].type === '' || scripts[i].type === 'text/javascript') {

          // Skip the script only executed after template is updated.
          if (scripts[i].dataset.run) {
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
      return callback(ele);
    }

    // Init web component's templates.
    for (var i = 0; i < tmpls.length; i++) {

      // After all templates inited;
      tmpls[i].addEventListener('template-inited', function() {
        tmplsInitCount++;
        if (tmplsInitCount === tmpls.length) {
          executeScript();
        }
      })

      tmpls[i].dispatchEvent(new Event('template-reload-it', {bubbles: true}));
    }

  }

  var initWebComponentsFinished = function(ele) {

    // All webComponents is loaded
    if (webComponentsCount <= 0) {

      // Trigger webcom-inited event on document.
      running = false;
      ;(webcomInited === false) && document.dispatchEvent(new Event('webcom-inited')) && (webcomInited = true);

    }
  }


  /*
  *  After loading all links. Init all web components in current document.
  *  1: init custom element if necessary.
  *  2: override current element's setAttribute function
  *  3: override current element's getAttribute function
  */
  var initWebComponents = function() {

    webComponentLinks--;
    if (webComponentLinks > 0) return;


    var eles = document.querySelectorAll('[data-is]');

    webComponentsCount = eles.length;

    debug && console.log('initWebComponents... count:' + webComponentsCount);
    for (var i = 0; i < eles.length; i++) {


      // Inited flag.
      if (eles[i][namespace + 'inited']) {
        webComponentsCount--;
        initWebComponentsFinished(eles[i]);
        continue;
      }


      // init flag && save old html
      eles[i][namespace + 'inited'] = true;
      eles[i]._innerHTML = eles[i].innerHTML || "";


      // Current web component is not exist.
      if (!customElements[eles[i].dataset.is]) {

        console.log('customElement ' + eles[i].dataset.is + ' not Found.')

      // Clone html to instance except CSS & JS.
      } else {

        var children = customElements[eles[i].dataset.is].children;
        for (var j = 0; j < children.length; j++) {

          if (children[j].nodeName !== 'SCRIPT' && children[j].nodeName !== 'STYLE' && children[j].nodeName !== 'LINK') {
            eles[i].appendChild(children[j].cloneNode(true))
          }

        }
      }


      // Init current customElement
      debug && console.log('initCustomElement ' + eles[i].dataset.is);
      initCustomElement(eles[i], function(ele) {

        webComponentsCount--;
        debug && console.log('webComponentsCount:' + webComponentsCount)

        // Bind function for template. Override setAttribute function.
        ele.setAttribute = setAttributeFun.bind(ele);
        if (ele.getAttribute('data-bind')) {
          ele.setAttribute('data-bind', ele.getAttribute('data-bind'));
        }

        // Override getAttribute function.
        ele.getAttribute = function(name) {

          if (name === 'data-bind') {
            return this._dataBind;
          }
          return Element.prototype.getAttribute.call(this, name);

        }

        // Execute _loaded function.
        ;(typeof ele[namespace + 'loaded'] === 'function') && ele[namespace + 'loaded']();

        initWebComponentsFinished(ele);

      });

    }

  }

  var loadLinkFinished = function(link, text) {

    try {

      var doc = document.createDocumentFragment();
      var wrapper = document.createElement("div");
      wrapper.innerHTML = text;
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

    initWebComponents();

  }

  var loadSingleLink = function(link) {

    var url = link.href;

    // No extern html should be loaded.
    if (!url) {
      initWebComponents();
      return;
    }

    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function(){

      // Extern html is loaded
      if (xmlHttp.readyState === 4) {

        if (xmlHttp.status !== 200) {

          console.log('request error');
          initWebComponents();

        } else {

          if (link.dataset.cacheid) {
            var obj = {
              expires: (+link.dataset.cachetime || 8.64e7) + Date.now(), // DefaultTime 1 day = 8.64e7 = 1000 * 60 * 60 * 24 = 86400000
              text: xmlHttp.responseText
            }
            localStorage.setItem("webcoms-" + link.dataset.cacheid, JSON.stringify(obj));
          }

          loadLinkFinished(link, xmlHttp.responseText);
        }

      }
    }

    /* Get cache from localStorage. */
    var cache = localStorage.getItem('webcoms-' + link.dataset.cacheid);
    try {
      cache = JSON.parse(cache);
    } catch (e) {
      cache = null;
    }

    /* Cache is exitst*/
    if (cache) {

      if (cache.expires >= Date.now()) {
        loadLinkFinished(link, cache.text);

      /*
       Cache is out of date.
        1, remove cache
        2, send new request.
      */
      } else {
        localStorage.removeItem('webcoms-' + link.dataset.cacheid);
        xmlHttp.send(null);
      }
    } else {
      xmlHttp.send(null);
    }
  }


  /*
  *  load all 'import-webcom' links
  */
  var init = function() {

    if (running) return;
    running = true;

    var links     = document.querySelectorAll('link[rel="import-webcom"]'),
        link;

    webComponentLinks = links.length;

    for (var i = 0; i < links.length; i++) {
      link = links[i];

      // Skip inited link.
      if (link[namespace + 'inited']) {
        initWebComponents();
        continue;
      }
      link[namespace + 'inited'] = true;

      // load html & init it.
      loadSingleLink(link);
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
  document.addEventListener('reload', init);

  document.addEventListener('template-appended', init);
  document.addEventListener('template-updated', init);
  return null;
}));
