!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var _prompt = window.prompt,
      temp;
  window.prompt = function(title, defaultText, callback) {

    // Use custom prompt.
    if (typeof callback === 'function') {

      var dialog =
      '<div class="system-prompt-wrapper"><div class="system-prompt"><div class="title">' +
      title +
      '</div><div class="content"><input value="' +
      defaultText +
      '"/></div><div class="foot"><button class="ok">确定</button><button class="cancel">取消</button></div></div></div>';

      // String to dom.
      temp = temp === undefined ? document.createElement("div") : temp;
      temp.innerHTML = dialog
      dialog = temp.firstChild;
      temp.innerHTML = '';

      document.getElementsByTagName('body')[0].appendChild(dialog);

      dialog.addEventListener('click', function(e) {

        if (e.target.className === 'ok') {

          var input = this.getElementsByTagName('input')[0];
          this.remove();
          typeof callback === 'function' && callback(input.value);

        } else if (e.target.className === 'cancel') {

          this.remove();
          typeof callback === 'function' && callback(null);

        }
      });

    // Use system prompt.
    } else {
      return _prompt(title, defaultText);
    }
  }

}));
