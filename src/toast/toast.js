!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}( function() {

  /**
   * alertMsg
   * @param  {[string, object]} options
   * @return {[object]}         [callback function]
   */
  var div = null;
	var alertMsg = function( options ) {

    var callback
      , defaults = {
          width     : 160,
          content   : "?",
          done      : null,
          time      : 1200,
          autohide  : true
        };

    // Build options
    if ( typeof( options ) === "string" ) {

      defaults.content = options;
      options = defaults;

    } else {

      for (var o in options) {
        defaults[o] = options[o]
      }
      options = defaults;
    }

    if (!div) {
      div = document.createElement('div');
      div.classList.add('toast');
      document.body.appendChild(div);
    }

    div.innerHTML = options.content;
    div.style.display = 'block';

    setTimeout(function(){
      div.style.marginTop = '-' + (window.getComputedStyle(div).height.replace(/px/, '') / 2) + 'px';
      div.style.opacity = "1";
    }, 10)

		if ( options.autohide ) {

			setTimeout( function() {

        div.style.opacity = 0;

        // After anmiation.
        setTimeout(function(){

          div.style.cssText = ''

          typeof callback === 'function' && callback();
          typeof options.done === 'function' && options.done();
        }, 1000)

			}, options.time );

		}

    return {
      then: function(cb){
        callback = cb;
      }
    };
	};

  window.toast = window.toast || alertMsg;

}));
