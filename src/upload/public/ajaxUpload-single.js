!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}( function(){

  var onended = function(d) {
    var url = d.results[0].url;
    this.style.backgroundImage = 'url(' + url + ')';
    this.querySelector('input').value = url;
  }

  Array.prototype.slice.apply(document.querySelectorAll('[data-ajaxUpload-plugin=single]')).forEach(function(ele) {
    ele.onended = onended.bind(ele);
  })

}));
