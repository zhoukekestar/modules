!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory();
  }
}( function() {


  document.addEventListener('click', function(e) {



    var path = e.path && e.path.concat();
    if (path[0].nodeName && path[0].nodeName !== 'A' && path[1].nodeName && path[1].nodeName !== 'A' && path[2].nodeName && path[2].nodeName !== 'A') {
      return;
    }

    while (path[0].nodeName && path[0].nodeName !== 'A') {
      path.shift();
    }
    var target = path[0];

    // ul > li > a
    if (target.nodeName === 'A' && path[1].nodeName === 'LI' && path[2].nodeName === 'UL'){

      // ul.nav > li > a
      if (path[2].classList.contains('nav')) {

        var mainNav = target;
        var subNav = mainNav.nextElementSibling;

        // ul.nav > li > a + .sub-nav
        if (subNav && subNav.classList.contains('sub-nav')) {
          e.preventDefault();

          if (subNav.classList.contains('collapse'))
            subNav.classList.remove('collapse')
          else
            subNav.classList.add('collapse');

        // Save current menu
        } else {
          sessionStorage['menu'] = mainNav.getAttribute('data-menu') || mainNav.getAttribute('href')  || new Date().getTime();
        }

      // ul.sub-nav > li > a
      } else if (path[2].classList.contains('sub-nav')) {

        var mainNav = target;
        var subNav = mainNav.nextElementSibling;

        // No any more sub-nav
        if (!subNav) {
          sessionStorage['menu'] = mainNav.getAttribute('data-menu') || mainNav.getAttribute('href') || new Date().getTime();
        }

      }
    }
  })

  var init = function() {
    var role = document.querySelector('[data-role="menu"]'),
        namespace = '_',
        i,
        max;

    if (role && !role[namespace + 'inited']) {
      role[namespace + 'inited'] = true;

      var links = role.querySelectorAll('a');

      // Compare absolute url at first.
      for (i = 0, max = links.length; i < max; i++) {
        if (links[i].href === location.href) {
          links[i].parentNode.classList.add('active');
          links[i].parentNode.parentNode.classList.remove('collapse');
          return;
        }
      }

      // Compare data-menu & href with sessionStorage.
      for (i = 0, max = links.length; i < max; i++) {
        var m = links[i].getAttribute('data-menu') || links[i].getAttribute('href');
        if (m === sessionStorage['menu']) {
          links[i].parentNode.classList.add('active');
          links[i].parentNode.parentNode.classList.remove('collapse');
          return;
        }
      }

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

  document.addEventListener('reload', init)

}));
