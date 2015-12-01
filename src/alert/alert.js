!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _alert  = window.alert
    , temp    = null
    , dialog  = '<div class="system-alert-wrapper"><div class="system-alert"><div class="content"></div><button class="close" onclick="">确定</button></div></div>'
    , option;
  window.alert = function(msg, o) {

    option = o;

    // If not inited, just init it.
    if (typeof dialog === 'string') {
      temp = document.createElement("div");
      temp.innerHTML = dialog
      dialog = temp.firstChild;
      dialog.style.display = 'none';
      document.body.appendChild(dialog);

      dialog.addEventListener('click', function(e) {
        if (e.target.className === 'close') {
          this.style.display = 'none';
          typeof option === 'function' && option();
        }
      });

    }


    // Use custom alert
    if ((typeof option === 'boolean' && option === false) || typeof option === 'function') {

      dialog.style.display = 'block'
      dialog.firstChild.firstChild.innerHTML = msg;

    // Use system alert
    } else {
      _alert(msg);
    }
  }

  return window.alert;

}));
