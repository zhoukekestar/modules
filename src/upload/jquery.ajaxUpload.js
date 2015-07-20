!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define([ "jquery" ], factory );
  } else {
    var init = factory( jQuery );
    init();
  }
}(function($){
  $.fn.ajaxUpload = function(options) {

    var $this;
    options = $.extend({
      delegate: "",
      success: function(){},
      error: function(){},
      progress: function(){}
    }, options);


    var submitHandler = function(e){
      e.preventDefault()

      if (window.FormData === undefined)
        alert('对不起，您的游览器不支持图片上传')

      var formData = new FormData($this[0])

      $.ajax({
        url: $this.attr('action'),  //server script to process data
        type: 'POST',
        xhr: function() {  // custom xhr
          var myXhr = $.ajaxSettings.xhr();
          if(myXhr.upload){ // if upload property exists
            myXhr.upload.addEventListener('progress', function(e) {
              var percent = (e.loaded / e.total * 100).toFixed(0);
              options.progress(percent, e);
            }, false); // progressbar
          }
          return myXhr;
        },
        //Ajax events
        success: options.success,
        error: options.error,
        // Form data
        data: formData,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
      }, 'json');

    };

    if (options.delegate === "") {
      $(this).submit(function(e){
        $this = $(this);
        submitHandler(e);
      })
    } else {
      $(this).delegate(options.delegate, 'submit', function (e) {
        $this = $(this);
        submitHandler(e);
      });
    }

  }
  return $;
}));
