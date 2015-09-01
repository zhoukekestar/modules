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

              // IE 10, IE 11
              // responseType is 'json'
              // @see http://caniuse.com/#search=formData
              if (typeof xmlHttp.response !== 'object') {

                options.success(JSON.parse(xmlHttp.response), xmlHttp);

              } else {

                options.success(xmlHttp.response, xmlHttp)
              }

            }
          }

          // Send it!
          xmlHttp.send(formData);

        },
        inputID = 'ajaxUpload-' + new Date().getTime(),
        inputEle,
        url     = self.getAttribute('data-url'),
        form    = document.createElement('form');


    // Extend options
    for (var key in o) {
      options[key] = o[key]
    }

    // Init
    self.innerHTML = '上传图片';

    // Add form element into body
    form.innerHTML = '<input id="' + inputID + '" data-url="' + url + '" type="file" name="file" value="" multiple style="display:none !important">';
    document.querySelector('body').appendChild(form)
    inputEle = document.getElementById(inputID);


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

  return ajaxUpload;

} ) );
