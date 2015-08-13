!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _confirm = window.confirm,
      temp;
  window.confirm = function(msg, option) {

    // Use custom confirm.
    if (typeof option === 'function') {

      var dialog =
      '<div class="system-confirm-wrapper"><div class="system-confirm"><div class="content">' +
      msg +
      '</div><div class="foot"><button class="ok">确定</button><button class="cancel">取消</button></div></div></div>';

      // String to dom.
      temp = temp === undefined ? document.createElement("div") : temp;
      temp.innerHTML = dialog
      dialog = temp.firstChild;
      temp.innerHTML = '';

      document.getElementsByTagName('body')[0].appendChild(dialog);

      dialog.addEventListener('click', function(e) {

        if (e.target.className === 'ok') {

          this.remove();
          typeof option === 'function' && option(true);

        } else if (e.target.className === 'cancel') {

          this.remove();
          typeof option === 'function' && option(false);

        }
      });

    // Use system confirm.
    } else {
      return _confirm(msg);
    }
  }

}));
