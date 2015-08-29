!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    window.ajaxUpload = factory( );
  }
}( function() {

  var ajaxUpload = function(ele, o) {

    var
        self    = (typeof ele === 'string') ? document.querySelector(ele) : ele,
        options = {
          progressall: 'upload-progress-top',
          abort: function() {},
          success: function(){},
          error: function(){},
          progress: function(){}
        },
        xmlHttp,
        loading = false,
        uploadFormData,

        showProgress = function() {
          var progressall = document.querySelector('.' + options.progressall);

          if (progressall === null) {
            var d = document.createElement('div');
            d.classList.add(options.progressall);
            d.innerHTML = '<span></span>';
            document.querySelector('body').appendChild(d);
            progressall = d;
          }

          var span = progressall.querySelector('span');
          progressall.style.opacity = 1;
          span.style.width = '0%';
          span.innerHTML = '0';
        },

        hideProgress = function() {
          var progressall = document.querySelector('.' + options.progressall);
          if (progressall !== null) {
           setTimeout(function() {

             var span = progressall.querySelector('span');
             progressall.style.opacity = 0;

             setTimeout(function(){

               span.style.width = '0%';
               span.innerHTML = '0';
             }, 1000);

           }, 1000);
          }
        },

        updateProgress = function(percent) {
          var span          = document.querySelector('.' + options.progressall + ' span');
          span.style.width  = percent + '%';
          span.innerHTML    = percent;
        },
        IEMode = window.FormData ? false : true;




    // Extend options
    for (var key in o) {
      options[key] = o[key]
    }

    // Upload form data
    // This function should call by `form` Element so that you can use `this` to get data.
    uploadFormData = function(url) {

      // Get form data include file
      var formData  = new FormData(this);

      // Set XMLHttpRequest
      xmlHttp = new XMLHttpRequest()
      xmlHttp.open("POST", url, true);
      xmlHttp.responseType = 'json';

      // Abort handler
      xmlHttp.onabort = function() {
        options.abort();
      }

      // Error handler
      xmlHttp.onerror = function(err) {
        options.error(err, xmlHttp)
      }

      // When upload is starting....
      // Show progress
      xmlHttp.onloadstart = function() {
        showProgress();
      }

      // Listen upload progress.
      xmlHttp.upload.addEventListener('progress', function(e){

        var percent = Math.floor(e.loaded / e.total * 100);

        updateProgress(percent);

        options.progress(percent, e);

      }, false);

      // After uploaded!
      xmlHttp.onreadystatechange = function(){
        if (xmlHttp.readyState === 4) {

          loading = false;
          self.innerHTML = '上传图片'

          hideProgress();

          options.success(xmlHttp.response, xmlHttp)
        }
      }

      // Send it!
      xmlHttp.send(formData);

    }


    // Init
    self.innerHTML = '上传图片';
    var inputID = 'ajaxUpload-' + new Date().getTime(),
        inputEle,
        url     = self.getAttribute('data-url'),
        form    = document.createElement('form');

    // Add form element into body
    form.innerHTML = '<input id="' + inputID + '" data-url="' + url + '" type="file" name="file" value="" multiple style="display:none !important">';
    document.querySelector('body').appendChild(form)
    inputEle = document.getElementById(inputID);




    if (!IEMode) {

      // Bind current element's click event.
      self.addEventListener('click', function() {


        if (loading === false) {
          inputEle.click();
        } else {
          xmlHttp.abort();
        }

      })

      inputEle.onchange = function() {

        loading = true;
        self.innerHTML = '取消上传'

        uploadFormData.call(this.parentNode, url);
      }
    }


    // For old browser.
    // Use jquery.fileupload plugin.
    if (IEMode) {

      /*

      require.config({
        paths: {
          jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min', // AMD
          'jquery.ui.widget'        : '//cdn.bootcss.com/blueimp-file-upload/9.10.4/vendor/jquery.ui.widget', // AMD
          'jquery.iframe-transport' : '//cdn.bootcss.com/blueimp-file-upload/9.5.7/jquery.iframe-transport.min.js', // AMD
          'jquery.fileupload'       : '//cdn.bootcss.com/blueimp-file-upload/9.5.7/jquery.fileupload.min',
          'jquery.uploadButton'     : 'jquery.uploadButton'
        }
      });

       */
      require(['jquery', 'jquery.fileupload'], function($) {

        $(self).on('click', function() {
          inputEle.click();
          showProgress();
        })

        $(inputEle).fileupload({
          dataType: 'json',

          progressall: function (e, data) {


            var percent = parseInt(data.loaded / data.total * 100, 10);
            updateProgress(percent)

            options.progress(percent);

          },
          done: function (e, data) {

            loading = false;
            self.innerHTML = '上传图片'

            hideProgress();

            options.success(data._response.result)
          }

        });

      })

    }

  }

  return ajaxUpload;

} ) );
