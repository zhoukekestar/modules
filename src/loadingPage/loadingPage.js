!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}(function(){

  var loading = function(){
    var ele = document.createElement("div");
  	ele.setAttribute("class", "loadingPage");
    try {
  	 document.querySelector("body").appendChild(ele);
    } catch (e) {
      alert('Please place #loadingPage# after body.')
    }
  }

  loading();


  document.addEventListener('loadingPageLoaded', function(e){
    var ele = document.querySelector('.loadingPage');
    if (ele) {
      try{
        ele.remove();
      } catch (e) {
        ele.parentNode.removeChild(ele)
      }
    }
  });

  document.addEventListener('loadingPageLoading', function(){
    loading();
  });

  window.loadingPage = {
    loading: function() {
      document.dispatchEvent(new Event('loadingPageLoading'));
    },
    loaded: function() {
      document.dispatchEvent(new Event('loadingPageLoaded'));
    }
  };

}));
