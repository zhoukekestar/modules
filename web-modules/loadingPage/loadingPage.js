!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
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
    if (typeof ele !== undefined && ele[0] !== undefined) {
      try{
        ele[0].remove();
      } catch (e) {
        ele[0].parentNode.removeChild(ele[0])
      }
    }
  });

  document.addEventListener('loadingPageLoading', function(){
    init();
  });

  window.loadingPage = {
    loading: function() {
      var eve;
      try {
        eve = new Event('loadingPageLoading');
      } catch (e) {
        eve = document.createEvent("HTMLEvents");
        eve.initEvent("loadingPageLoading", false, false);
      }
      document.dispatchEvent(eve);
    },
    loaded: function() {
      var eve;
      try {
        eve = new Event('loadingPageLoaded');
      } catch (e) {
        eve = document.createEvent("HTMLEvents");
        eve.initEvent("loadingPageLoaded", false, false);
      }
      document.dispatchEvent(eve);
    }
  };

  return loadingPage;
  /**
   * document.dispatchEvent(new Event('loadingPageLoaded'));
   * document.dispatchEvent(new Event('loadingPageLoading'));
   */
}));
