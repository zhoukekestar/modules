!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(factory );
  } else {
    factory( );
  }
}(function( ){

  var imageView = null;
  var allImages = null;
  var currentTarget = null;

  var initImageView = function() {
    imageView = document.createElement('div');
    imageView.classList.add('imageView');
    imageView.innerHTML = '<span class="close"></span><div class="img"><span class="pre"></span><span class="next"></span></div>';
    document.body.appendChild(imageView);


    imageView.querySelector('span.close').onclick = function() {
      imageView.style.opacity = 0;
      setTimeout(function(){
        imageView.style.zIndex = -1;
      }, 500)
    }

    imageView.querySelector('span.pre').onclick = function() {
      for (var i = allImages.length; i >= 0; i--) {
        if (allImages[i] === currentTarget) {
          currentTarget = allImages[(i - 1 >= 0 ? i - 1 : allImages.length - 1)];
          return setImage(currentTarget)
        }
      }
    }

    imageView.querySelector('span.next').onclick = function() {
      var length = allImages.length;

      for (var i = 0; i < length; i++) {
        if (allImages[i] === currentTarget) {
          currentTarget = allImages[(i + 1 < length ? i + 1 : 0)];
          return setImage(currentTarget)
        }
      }
    }

    return imageView;
  }

  var setImage = function(target) {
    if (target.getAttribute('src')) {
      imageView.querySelector('.img').style.backgroundImage = 'url(' + target.getAttribute('src') + ')';
    } else if(target.style.backgroundImage) {
      imageView.querySelector('.img').style.backgroundImage = target.style.backgroundImage;
    } else {
      imageView.querySelector('.img').style.backgroundImage = 'url(none)';
    }
    imageView.style.opacity = 1;
    imageView.style.zIndex = 10001;
  }

  document.addEventListener('click', function(e) {
    var target = e.target;

    if (target.getAttribute('data-role') === 'imageView') {
      if (!imageView) initImageView();

      allImages = document.querySelectorAll('[data-role="imageView"]');
      currentTarget = target;

      setImage(target);
    }
  })


  return null;


}));
