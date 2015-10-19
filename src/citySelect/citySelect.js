!( function( factory ){
  if (typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var cityData;
  var initCitySelect = function( o ){

    var options = {
      eles: null,
      data: [],
      valname: "v",
      showname: "n",
      arrname: "s"
    };

    for (var key in o) {
      options[key] = o[key]
    }


    /**
     * *
     * @param  {[elements]}         eles  [The elements]
     * @param  {[object]}           data  [Current level's data]
     * @param  {[number]}           count [Current level]
     */
    var nextSelect = function(eles, data, count) {

      // Nothing to do, just return.
      if (data === undefined || data === null || data.length === 0 || !eles[count])
        return;


      var defaultVal = eles[count].getAttribute('data-default') || '--请选择--',
          html = '<option value="">' + defaultVal + '</option>',
          i,
          max;

      // Add current options & show it.
      for (i = 0, max = data.length; i < max; i++) {
        html += '<option value="' + data[i][options.valname] + '">'+ data[i][options.showname] + '</option>';
      }

      var temp = document.createElement("div");
      temp.innerHTML = html;
      [].slice.call(temp.children).forEach(function(child) {
        eles[count].appendChild(child);
      })

      eles[count].style.display = 'inline';

      // Unbind old handler & Bind select change event.
      //
      var changeHandler = function(){

        //$( eles[count] ).off();
        // need to remove listener???

        // Remove the greater level elements
        for (i = count + 1, max = eles.length; i < max; i++) {

          var ops = eles[i].querySelectorAll('option');
          eles[i].removeEventListener(changeHandler);

          [].slice.call(ops).forEach(function(ele){
            ele.remove();
          })
          eles[i].style.display = 'none';

        }

        // If you select -1, it means that you have not select any option. Do nothing.
        if (this.value === -1)
          return;

        for (i = 0, max = data.length; i < max; i++) {

          if (data[i][options.valname] == this.value) {

            nextSelect(eles, data[i][options.arrname], count + 1);
          }
        }
      }
      eles[count].addEventListener('change', changeHandler);

    };

    // Hide all elements.
    [].slice.call(options.eles).forEach(function(ele){
      ele.style.display = 'none';
    })

    // initCitySelect the first level.
    nextSelect(options.eles, options.data, 0);
  };

  var citySelect = function(eles, url) {

    eles  = (typeof eles === 'string') ? document.querySelectorAll(eles) : eles;
    url   = !url ? './city.min.json' : url;

    var _callback = false;

    // If had cityData.
    if (cityData) {

      initCitySelect({
        eles: eles,
        data: cityData
      })

      _callback = typeof _callback === 'function' ? _callback() : true;


    // No cityData, get it by ajax.
    } else {

      var xhr = new XMLHttpRequest()
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function(){
        if (xhr.readyState === 4) {
          var json = JSON.parse(xhr.responseText);
          cityData = json;
          initCitySelect({
            eles: eles,
            data: json
          });
          _callback = typeof _callback === 'function' ? _callback() : true;

        }
      }
      xhr.send();

    }

    // Return selected function.
    return {
      selected: function(s) {

        // Make sure that city-json-data is loaded.
        if (_callback === false) {
          _callback = function() {
            for (var i = 0; i < s.length; i++) {
              eles[i].querySelector('option[value="'+ s[i]+'"]').selected = true;

              eles[i].dispatchEvent(new Event('change', {bubbles: true}))
              eles[i].onchange && eles[i].onchange();
            }
            return true;
          }
        } else {
          for (var i = 0; i < s.length; i++) {
            eles[i].querySelector('option[value="'+ s[i]+'"]').selected = true;

            eles[i].dispatchEvent(new Event('change', {bubbles: true}))
            eles[i].onchange && eles[i].onchange();
          }
        }
      }
    }

  };

  var init = function() {
    var role = document.querySelector('[data-role="citySelect"]');
    var namespace = '_';
    if (role && !role[namespace + 'inited']) {
      role[namespace + 'inited'] = true;
      role[namespace + 'selected'] = citySelect(role.querySelectorAll('select'), role.getAttribute('data-url')).selected;

      var selected = role.getAttribute('data-selected');
      if (selected) {
        selected = JSON.parse(selected);
        role[namespace + 'selected'](selected);
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
