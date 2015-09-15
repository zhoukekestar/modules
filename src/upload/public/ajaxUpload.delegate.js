!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}( function() {

  var ajaxUpload = function(ele) {

    var
        self    = (typeof ele === 'string') ? document.querySelector(ele) : ele,
        progressallClass = 'upload-progress-top',
        xmlHttp,
        loading = false,

        showProgress = function() {
          var progressall = document.querySelector('.' + progressallClass);

          if (progressall === null) {
            var d = document.createElement('div');
            d.classList.add(progressallClass);
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
          var progressall = document.querySelector('.' + progressallClass);
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
          var span          = document.querySelector('.' + progressallClass + ' span');
          span.style.width  = percent + '%';
          span.innerHTML    = percent;
        },

        // Upload form data
        // This function should call by `form` Element so that you can use `this` to get data.
        uploadFormData = function(url) {

          var thisButton= self;
          // Get form data include file
          var formData  = new FormData(this);

          // Set XMLHttpRequest
          xmlHttp = new XMLHttpRequest()
          xmlHttp.open("POST", url, true);
          xmlHttp.responseType = 'json';

          // Abort handler
          xmlHttp.onabort = function() {
            (typeof thisButton.onabort === 'function') && (thisButton.onabort());
          }

          // Error handler
          xmlHttp.onerror = function(err) {
            (typeof thisButton.onerror === 'function') && (thisButton.onerror(err, xmlHttp));
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

            (typeof thisButton.onprogress === 'function') && (thisButton.onprogress(percent, e));

          }, false);

          // After uploaded!
          xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState === 4) {

              loading = false;
              self.innerHTML = '上传图片'

              hideProgress();

              var response = null;
              // IE 10, IE 11
              // responseType is 'json'
              // @see http://caniuse.com/#search=formData
              if (typeof xmlHttp.response !== 'object') {
                response = JSON.parse(xmlHttp.response);
              } else {
                response = xmlHttp.response;
              }

              (typeof thisButton.onended === 'function') && (thisButton.onended(response, xmlHttp));

            }
          }

          // Send it!
          xmlHttp.send(formData);

        },
        inputID = 'ajaxUpload-' + new Date().getTime(),
        inputEle,
        url     = self.getAttribute('data-url'),
        form    = document.createElement('form');

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

  document.addEventListener('click', function(e) {

    var target = e.target;
    if (target.getAttribute('data-role') === 'ajaxUpload') {

      if (target.inited === undefined) {
        target.inited = true;
        ajaxUpload(target)
        target.click();
      }
    }
  })

  return null;

} ) );
