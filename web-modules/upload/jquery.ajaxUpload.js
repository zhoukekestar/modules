(function($) {
  $.fn.ajaxUpload = function(options) {

    var $this = $(this);
    options = $.extend({
      success: function(){},
      error: function(){},
      progress: function(){}
    }, options);

    $(this).submit(function(e){
      e.preventDefault()
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

    });

  }
})( jQuery )
