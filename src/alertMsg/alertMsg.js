!( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define(factory );
	} else {
		factory();
	}
}( function() {


  /**
   * alertMsg
   * @param  {[string, object]} options
   * @return {[object]}         [callback function & remove function]
   */
	var alertMsg = function( options ) {

    var defaults = {
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

    var
      // callback function
      callback,

      alertMsgCSS = {
        "color": "#FFF",
        "font-size": "18px",
        "background-color": "rgba(0, 0, 0, 0.8)",
        "border-radius": "10px",
        "box-sizing": "border-box",
        "text-align": "center",
        "z-index": "99999",
        "word-break": "break-word",
        "padding": "12px",
        "position": "fixed",
        "left": "50%",
        "top": "50%",
        "text-shadow": "none",
        "width": options.width + 'px',
        "margin-left": '-' + ( options.width / 2 ) + 'px',
        "opacity": 0,
        "-webkit-transition": "all 1s",
        "transition": "all 1s"
      },

      div = document.createElement('div'),

      css,

      needRemove = false;



    // Build alertMsg's Div element.
    div.innerHTML = options.content;
    for (css in alertMsgCSS) {
      div.style[css] = alertMsgCSS[css];
    }

    // Before compute div's height, you should put it into current document.
    document.body.appendChild(div);
    div.style.marginTop = '-' + (window.getComputedStyle(div).height.replace(/px/, '') / 2) + 'px';


    div.style.opacity = "1";
		if ( options.autohide ) {

			setTimeout( function() {
        div.style.opacity = "0";
        needRemove = true;
			}, options.time );

		}

    // Listen transition
    div.addEventListener((div.style.transition === undefined ? 'webkitTransitionEnd' : 'transitionend'), function(){
      if (needRemove === true) {
        div.remove();
        if (typeof callback === 'function') {
         callback();
        }
        if (typeof options.done === 'function') {
          options.done();
        }
      }
    });

    return {
      then: function(cb){
        callback = cb;
      }
    };
	};

	return alertMsg;
}));
