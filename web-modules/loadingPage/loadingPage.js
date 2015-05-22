!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( jQuery );
  }
}(function(){

  var init = function(){
    var ele = document.createElement("div");
  	ele.setAttribute("class", "loadingPage");
  	document.getElementsByTagName("body")[0].appendChild(ele);
  }

  init();

  document.addEventListener('loadingPageLoaded', function(e){
    var ele = document.getElementsByClassName('loadingPage');
    if (typeof ele !== undefined) ele[0].remove();
  });

  document.addEventListener('loadingPageLoading', function(){
    init();
  });

  window.loadingPage = {
    loading: function() {
      document.dispatchEvent(new Event('loadingPageLoading'));
    },
    loaded: function() {
      document.dispatchEvent(new Event('loadingPageLoaded'));
    }
  };

  return loadingPage;
  /**
   * document.dispatchEvent(new Event('loadingPageLoaded'));
   * document.dispatchEvent(new Event('loadingPageLoading'));
   */
}));
