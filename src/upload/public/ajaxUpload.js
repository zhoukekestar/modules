!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}( function() {

  var ajaxUpload = function(ele) {

    var
        self              = (typeof ele === 'string') ? document.querySelector(ele) : ele,
        progressallClass  = 'upload-progress-top',
        mobileClass       = 'mobile',
        ua                = window.navigator.userAgent.toLowerCase(),
        loading           = false,
        xmlHttp,

        showProgress = function() {
          var progressall = document.querySelector('.' + progressallClass);

          if (progressall === null) {
            var d = document.createElement('div');
            d.classList.add(progressallClass);


            if (ua.indexOf('android') !== -1 || ua.indexOf('iphone') !== -1) {
              d.classList.add(mobileClass);
            }

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

          // Get form data include file
          var formData  = new FormData(this);

          // Set XMLHttpRequest
          xmlHttp = new XMLHttpRequest()
          xmlHttp.open("POST", url, true);
          xmlHttp.responseType = 'json';

          // Abort handler
          xmlHttp.onabort = function() {
            (typeof self.onabort === 'function') && (self.onabort());
          }

          // Error handler
          xmlHttp.onerror = function(err) {
            (typeof self.onerror === 'function') && (self.onerror(err, xmlHttp));
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

            (typeof self.onprogress === 'function') && (self.onprogress(percent, e));

          }, false);

          // After uploaded!
          xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState === 4) {

              loading = false;
              // self.innerHTML = self._innerHTML;

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

              (typeof self.onended === 'function') && (self.onended(response, xmlHttp));

            }
          }

          // Send it!
          xmlHttp.send(formData);

        },
        inputID = 'ajaxUpload-' + new Date().getTime() + '' + (Math.random() + '').substring(3, 8),
        inputEle,
        url     = self.getAttribute('data-url'),
        form    = document.createElement('form');

    // Bind current element
    form._bind = self;

    // Add form element into body
    form.style.cssText = '    position: fixed;    left: 0px;    top: 0px;    width: 0;    height: 0;    overflow: hidden;';
    form.innerHTML = '<input'
      + ' id="' + inputID + '" '
      + ' data-url="' + url + '" '
      + ' type="file" name="file" value="" '
      + (self.dataset.multiple === 'false' ? '' : ' multiple ')
      + (self.dataset.accept ? ' accept="' + self.dataset.accept + '" ' : '')
      + '>';
    document.querySelector('body').appendChild(form)
    inputEle = document.getElementById(inputID);

    // Bind current element's click event.
    self.addEventListener('click', function() {


      if (loading === false) {
        inputEle.click();
      } else {
        loading = false;
        xmlHttp && xmlHttp.abort();
        form.reset();
        alert('已取消上传');
      }

    })

    inputEle.onchange = function() {

      // self._innerHTML = self.innerHTML;
      // self.innerHTML = '取消上传'

      uploadFormData.call(this.parentNode, url);
    }

    // Trigger input & alert system file-upload view
    inputEle.click();
    return inputEle;
  }

  document.addEventListener('click', function(e) {

    var target = e.target;
    if (target.getAttribute('data-role') === 'ajaxUpload') {

      if (target.inited === undefined) {
        target.inited = true;
        alert('ajaxUpload init')
        ajaxUpload(target)
      }
    }
  })

  var init = function() {
    var eles = document.querySelectorAll('[data-role=ajaxUpload]');
    for (var i = 0, max = eles.length; i < max; i++) {

      if (!eles[i].inited) {
        eles[i].inited = true;
        ajaxUpload(eles[i]);
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init()
  } else {
    document.addEventListener('readystatechange', function(e) {
      if (document.readyState === 'interactive') {
        init();
      }
    })
  }

  return null;

} ) );
