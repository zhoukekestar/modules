!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _alert = window.alert;
  window.alert = function(msg, sys) {

    // Default value is false
    sys = sys === undefined ? false : true;

    if (sys === true) {
      _alert(msg)
    } else {

      var dialog = '<div class="system-alert-wrapper"><div class="system-alert"><div class="content">' + msg + '</div><button class="close" onclick="">确定</button></div></div>';
      //dialog = (new DOMParser()).parseFromString(dialog, "text/xml").firstChild;

      var temp = document.createElement("div")
      temp.innerHTML = dialog

      dialog = temp.firstChild;

      document.getElementsByTagName('body')[0].appendChild(dialog)

      dialog.addEventListener('click', function(e) {
        if (e.target.className === 'close') {
          this.remove();
        }
      });
    }
  }

}));
