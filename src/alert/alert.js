!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _alert = window.alert,
      temp,
      useSystem = false;
  window.alert = function(msg) {

    // Use system alert OR not.
    if (typeof msg === 'boolean') {
      useSystem = msg;
      return;
    }

    if (useSystem === true) {
      _alert(msg)
    } else {

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
        }
      });
    }
  }

}));
