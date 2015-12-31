!(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    factory();
  }
}(function() {

  var
    showDeletable = function() {
      this.classList.add('deletable-show');
    },
    hideDeletable = function() {
      this.classList.remove('deletable-show');
    },
    init = function() {
      var eles = document.querySelectorAll('[data-role="deletable"]');

      for (var i = 0; i < eles.length; i++) {

        if (!eles[i]._inited) {
          eles[i]._inited = true;

          eles[i].classList.add('deletable');

          var deleteEle = document.createElement('div');
          deleteEle.classList.add('deletable-btn')
          eles[i].appendChild(deleteEle)

          if (eles[i].style.position === '') {
            eles[i].style.position = 'relative';
          }

          deleteEle.onclick = function() {
            this.parentNode.dispatchEvent(new Event('deletable-deleted', {
              bubbles: true
            }))
          }

          eles[i].addEventListener('taphold', showDeletable)
          eles[i].addEventListener('swipeleft', showDeletable)
          eles[i].addEventListener('swiperight', hideDeletable)
        }
      }
    };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

  document.addEventListener('deletable-reload', init)

  return null;

}));
