!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(factory );
  } else {
    factory( );
  }
}(function( ){

  var imageView = null;

  var initImageView = function() {
    imageView = document.createElement('div');
    imageView.classList.add('imageView');
    imageView.innerHTML = '<span>&times;</span><div class="img"></div>';
    document.body.appendChild(imageView);


    imageView.querySelector('span').addEventListener('click', function() {
      imageView.style.opacity = 0;
      setTimeout(function(){
        imageView.style.zIndex = -1;
      }, 500)
    })

    return imageView;
  }

  document.addEventListener('click', function(e) {
    var target = e.target;

    if (target.getAttribute('data-role') === 'imageView') {
      if (!imageView) initImageView();

      imageView.querySelector('.img').style.backgroundImage = 'url(' + target.getAttribute('src') + ')';
      imageView.style.opacity = 1;
      imageView.style.zIndex = 1001;
    }
  })


  return null;


}));
