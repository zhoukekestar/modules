!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _alert = window.alert,
      temp;
  window.alert = function(msg, option) {

    // Use custom alert
    if ((typeof option === 'boolean' && option === false) || typeof option === 'function') {

      var dialog = '<div class="system-alert-wrapper"><div class="system-alert"><div class="content">' + msg + '</div><button class="close" onclick="">确定</button></div></div>';
      //dialog = (new DOMParser()).parseFromString(dialog, "text/xml").firstChild;

      // String to dom.
      temp = temp === undefined ? document.createElement("div") : temp;
      temp.innerHTML = dialog
      dialog = temp.firstChild;
      temp.innerHTML = '';

      document.getElementsByTagName('body')[0].appendChild(dialog);

      dialog.addEventListener('click', function(e) {
        if (e.target.className === 'close') {
          this.remove();

          typeof option === 'function' && option();
        }
      });

    // Use system alert
    } else {
      _alert(msg);
    }
  }

}));
