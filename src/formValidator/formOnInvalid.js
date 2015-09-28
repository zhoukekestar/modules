!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var showOneMessageInOneMinute = true;
  document.addEventListener('invalid', function(e) {

    e.target.classList.add('formValidator-invalid');
    e.target.classList.remove('formValidator-valid');

    if (e._type !== 'input') {

      if (showOneMessageInOneMinute) {
        var alert = window.toast || window.alert;
        showOneMessageInOneMinute = false;
        alert(e._invalidationMessage);

      }
      setTimeout(function(){
        showOneMessageInOneMinute = true;
      }, 100)

    }
  })

  document.addEventListener('valid', function(e) {
    e.target.classList.add('formValidator-valid');
    e.target.classList.remove('formValidator-invalid');
  })
}));
