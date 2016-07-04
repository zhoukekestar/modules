!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var slice = [].slice;
  var init = function() {

    slice.apply(document.querySelectorAll('[data-role="tabs"]')).forEach(function(tabs) {

      // Set tab's width
      var width = 100 / tabs.querySelectorAll('.tabs-list > li').length;
      slice.apply(tabs.querySelectorAll('.tabs-list > li')).forEach(function(tab, index) {
        tab.style.width = width + '%';
        tab.setAttribute('data-index', index);
      })

      // Show active tab
      // Show active content & hide other content
      //
      var active_tab = tabs.querySelector('.tabs-list > li.active') || tabs.querySelector('.tabs-list > li');

      var active_content = active_tab.getAttribute('data-href');
      active_content = tabs.querySelector('.tabs-content > ' + active_content);

      // Don't have active tab or don't have active content.
      // Just return.
      if (!active_tab || !active_content) {
        return;
      }

      slice.apply(tabs.querySelectorAll('.tabs-content > div')).forEach(function(content) {
        content.style.display = 'none';
      })
      active_tab.classList.add('active');
      active_content.style.display = 'block';

      // Set line
      var line = tabs.querySelector('.line span');
      if (!line) {
        line = document.createElement('div');
        line.classList.add('line');
        line.innerHTML = '<span></span>';
        tabs.querySelector('.tabs-nav').appendChild(line);
        line = tabs.querySelector('.line span');
      }
      line.style.width = width + '%';
      line.style.left = (+active_tab.getAttribute('data-index')) * width + '%';

      // Bind tab's click event.
      tabs.addEventListener('click', function(e){

        var target = e.target;
        var temp_tab = target.getAttribute('data-href');
        var temp_content;

        if (target.parentNode.classList.contains('tabs-list') && temp_tab && (tabs.onselected ? tabs.onselected(e) !== false : true)) {

          // Hide
          active_tab.classList.remove('active');
          active_content.style.display = 'none';


          // Show
          temp_content = tabs.querySelector('.tabs-content > ' + temp_tab);
          temp_tab = e.target;

          temp_tab.classList.add('active');
          temp_content.style.display = 'block';

          if (line)
            line.style.left = (+temp_tab.getAttribute('data-index')) * width + '%';


          // Update acitve tab & content
          active_tab = temp_tab;
          active_content = temp_content;
        }
      })
    })
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

  document.addEventListener('reload', init);
  document.addEventListener('tabs-reload', init);
  return null;

}));
