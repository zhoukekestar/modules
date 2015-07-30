!( function( factory ){
  if (typeof define === "function" && define.amd ) {
    define( [ "jquery" ], factory );
  } else {
    factory( jQuery );
  }
}( function($){

  var cityData;
  var citySelect = function( options ){
    options = $.extend( {
      $this: null,
      data: [],
      valname: "v",
      showname: "n",
      arrname: "s"
    }, options );

    /**
     * *
     * @param  {[jquery elements]}  $ele  [The jquery elements]
     * @param  {[object]}           data  [Current level's data]
     * @param  {[number]}           count [Current level]
     */
    function nextSelect($ele, data, count)
    {
      // Nothind to do, just return.
      if (data === undefined || data === null || data.length === 0)
        return;


      var html = '<option value="-1">--请选择--</option>',
          i,
          max;

      // Add current options & show it.
      for (i = 0, max = data.length; i < max; i++) {

        html += '<option value="' + data[i][options.valname] + '">'+ data[i][options.showname] + '</option>';
      }
      $( $ele[count] ).append(html).show();

      // Unbind old handler & Bind select change event.
      $( $ele[count] ).off();
      $( $ele[count] ).on('change', function(){

        // Remove the greater level elements
        for (i = count + 1, max = $ele.length; i < max; i++) {

          $( $ele[i] ).find("option").remove();
          $( $ele[i] ).hide().off();
        }

        // If you select -1, it means that you have not select any option. Do nothing.
        if ($(this).val() === -1)
          return;

        for (i = 0, max = data.length; i < max; i++) {

          if (data[i][options.valname] == $(this).val()) {

            nextSelect($ele, data[i][options.arrname], count + 1);
          }
        }
      });

    }

    // Hide all elements.
    options.$this.hide();

    // Init the first level.
    nextSelect(options.$this, options.data, 0);
  };

  $.fn.citySelect = function(url){

    url = url === undefined ? './city.min.json' : url;
    var $this = $(this);
    var _callback = false;

    // If had cityData.
    if (cityData) {

      citySelect({
        $this: $this,
        data: cityData
      })

      _callback = typeof _callback === 'function' ? _callback() : true;


    // No cityData, get it by ajax.
    } else {

      $.getJSON(url, function(json){
        cityData = json;
        citySelect({
          $this: $this,
          data: json
        });
        _callback = typeof _callback === 'function' ? _callback() : true;
      });

    }

    // Return selected function.
    var resturnObj = {
      selected: function(s) {

        if (_callback === false) {
          _callback = function() {
            for (var i = 0; i < s.length; i++) {
              $( $this[i] ).find("option[value="+ s[i]+"]").attr("selected", true).trigger("change");
            }
            return true;
          }
        } else {
          for (var i = 0; i < s.length; i++) {
            $( $this[i] ).find("option[value="+ s[i]+"]").attr("selected", true).trigger("change");
          }
        }
        return resturnObj;
      }
    }

    return resturnObj;
  };


  return $;
}));
