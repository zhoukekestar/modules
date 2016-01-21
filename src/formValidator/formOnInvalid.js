!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var defaultHolder = 'body';

  /**
  * Show only one message in one minute.
  */
  var showOnlyOneMessageInOneMinute = true;
  document.addEventListener('invalid', function(e) {

    e.target.classList.add('formValidator-invalid');
    e.target.classList.remove('formValidator-valid');

    /*
    * e._type : [focusout] NOT 'input' event
    */
    if (e._type !== 'input') {

      if (e.target.errorMsgBox && e.target.errorMsgBox.innerHTML !== e._invalidationMessage) {
        // remove & update
        e.target.errorMsgBox.remove()
        e.target.errorMsgBox = null;
      }

      if (!e.target.errorMsgBox) {
        var target = e.target
          , width  = +(getComputedStyle(target).width.split('px')[0])
          , height = +(getComputedStyle(target).height.split('px')[0])
          , top    = document.body.scrollTop + target.getBoundingClientRect().top
          , left   = document.body.scrollLeft + target.getBoundingClientRect().left;

        var errorMsgBox = document.createElement('div');
        errorMsgBox.innerHTML = e._invalidationMessage;
        errorMsgBox.classList.add('formValidator-errorMsgBox');

        // append it to holder
        var holder = e.target.getAttribute('data-errorMsgBoxHolder') || defaultHolder;
        holder = document.querySelector(holder);
        holder.appendChild(errorMsgBox);

        if (holder !== document.body) {

          // Set holder's style
          if (getComputedStyle(holder).position === 'static') {
            holder.style.position = 'relative'
          }
          top -= (document.body.scrollTop + holder.getBoundingClientRect().top);
          top += holder.scrollTop;
          left -= (document.body.scrollLeft + holder.getBoundingClientRect().left);
          left += holder.scrollLeft;
        }


        errorMsgBox.style.left = (left + width / 2) + 'px';
        errorMsgBox.style.top  = (top + height) + 'px';

        e.target.errorMsgBox = errorMsgBox;
      }

      // if (showOnlyOneMessageInOneMinute) {
      //   var alert = window.toast || window.alert;
      //   showOnlyOneMessageInOneMinute = false;
      //   alert(e._invalidationMessage);
      //
      // }
      // setTimeout(function(){
      //   showOnlyOneMessageInOneMinute = true;
      // }, 100)

    }
  })

  document.addEventListener('formOnInvalid-setDefaultHolder', function(e) {
    defaultHolder = e.value;
  })

  document.addEventListener('valid', function(e) {
    e.target.classList.add('formValidator-valid');
    e.target.classList.remove('formValidator-invalid');
    if (e.target.errorMsgBox) {
      e.target.errorMsgBox.remove()
      e.target.errorMsgBox = null;
    }
  })
}));
