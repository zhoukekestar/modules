!( function( factory ){
  if (typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {

  var clearable = function(ele) {

    if (!ele.parentNode.classList.contains('clearable')) {
      var wrapper = document.createElement('div');
      wrapper.classList.add('clearable')
      wrapper.innerHTML = ele.outerHTML + '<span class="clearable-button"></span>';
      ele.parentNode.insertBefore(wrapper, ele);

      ele.remove();

      wrapper.querySelector('input').addEventListener('input', function(e) {
        if (this.length !== 0) {
          this.parentNode.classList.add('active')
        } else {
          this.parentNode.classList.remove('active')
        }
      })

      wrapper.querySelector('.clearable-button').onclick = function() {
        wrapper.querySelector('input').value = '';
        wrapper.classList.remove('active')
      }

      // show icon if input is not null
      if (wrapper.querySelector('input').value.length !== 0) {
        wrapper.classList.add('active');
      }

    }

  }

  var init = function() {
    var inputs = document.querySelectorAll('input[clearable="true"]');
    for (var i = 0; i < inputs.length; i++) {
      clearable(inputs[i]);
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

  document.addEventListener('reload', init);
  document.addEventListener('clearable-reload', init);
  return null;

}));
