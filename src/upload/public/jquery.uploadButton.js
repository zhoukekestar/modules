
!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define(['jquery', 'jquery.fileupload'], factory );
  } else {
    factory( jQuery );
  }
}( function( $ ) {

  $.fn.uploadButton = function(callback) {

    var url = $(this).data('url');
    var buttonID = 'fileupload-' + (new Date().getTime());
    var button = '<input id="' + buttonID + '" type="file" data-url="' + url + '" multiple style="display:none;">';
    $(this).append(button);

    $('#' + buttonID).fileupload({
      dataType: 'json',
      progressall: function (e, data) {

        if ($('.upload-progress-top').length === 0) {
          $('body').append('<div class="upload-progress-top"><span></span></div>')
        }
        $('.upload-progress-top').show();
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('.upload-progress-top span').css('width', progress + '%').html(progress);

      },
      done: function (e, data) {
        $('.upload-progress-top').fadeOut();

        callback(e, data);
      }
    });

    $(this).click(function(){
      $('#' + buttonID)[0].click();
    })
  }

  return $;

}));
