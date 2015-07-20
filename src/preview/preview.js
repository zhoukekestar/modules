!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define([ "jquery" ], factory );
  } else {
    factory( jQuery );
  }
}( function( $ ) {

  $.fn.preview = function(o) {

    // var options = $.extend({

    // }, o);

    var $this = $(this);
    var results = [];
    // element number
    var en = $(this).length;
    var callback;

    var loadEle = function(ei) {


      var fn, files = $this[ei].files;
      fn = files.length;

      var loadFile = function(fi) {
        var reader = new FileReader()
        reader.readAsDataURL(files[fi])
        reader.onload = function() {
          results.push(this.result);

          fi = fi + 1;
          if (fi < fn) {
            loadFile(fi);
          } else {
            // all results geted
            ei = ei + 1
            if (ei < en) {
              loadEle(ei)
            } else {
              callback(results);
            }
          }
        }
      }
      loadFile(0);

    };
    loadEle(0);


    return {
      then: function(c) {
        callback = c;
      }
    }

  }

  return $;
}));
