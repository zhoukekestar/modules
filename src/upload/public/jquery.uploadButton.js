
!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define([ "jquery" ], factory );
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

        if ($('#fileupload-progressall').length === 0) {
          $('body').append('<div id="fileupload-progressall"><span></span></div>')
        }
        $('#fileupload-progressall').show();
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#fileupload-progressall span').css('width', progress + '%').html(progress);

      },
      done: function (e, data) {
        $('#fileupload-progressall').fadeOut();

        callback(e, data);
      }
    });

    $(this).click(function(){
      $('#' + buttonID)[0].click();
    })
  }

  return $;

}));
