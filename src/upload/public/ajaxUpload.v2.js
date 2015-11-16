!( function( factory ) {
  if ( typeof define === "function" && define.amd ) {
    define( factory );
  } else {
    factory( );
  }
}( function() {

  var ajaxUpload = function(ele, indexEle) {

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

        pushSegment = function (oFREvt) {

          var owner = this.owner;
          owner.segments[this.segmentIdx] += oFREvt.target.result + "\r\n";
          owner.status--;

          if (owner.status > 0) {
            return;
          } else {
            submitData(owner);
          }
        },

        submitFiles = function(oField, url) {

          if (!oField.files) {
            return;
          }

          var oSegmReq,
              oFile;

          oField.url = url;
          oField.status = 0;
          oField.segments = [];

          for (var i = 0; i < oField.files.length; i++) {
            oFile = oField.files[i];
            oSegmReq = new FileReader();
            /* (custom properties:) */
            oSegmReq.segmentIdx = oField.segments.length;
            oSegmReq.owner = oField;
            /* (end of custom properties) */
            oSegmReq.onload = pushSegment;
            oField.segments.push("Content-Disposition: form-data; name=\"" + oField.name + "\"; filename=\""+ oFile.name + "\"\r\nContent-Type: " + oFile.type + "\r\n\r\n");
            oField.status++;
            oSegmReq.readAsBinaryString(oFile);
          }
        },

        // Upload form data
        // This function should call by `form` Element so that you can use `this` to get data.
        submitData = function(oData) {

          var sBoundary = "---------------------------" + Date.now().toString(16);

          // Set XMLHttpRequest
          xmlHttp = new XMLHttpRequest()
          xmlHttp.open("POST", oData.url, true);
          xmlHttp.responseType = 'json';
          xmlHttp.setRequestHeader("Content-Type", "multipart\/form-data; boundary=" + sBoundary);

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
          xmlHttp.sendAsBinary("--" + sBoundary + "\r\n" + oData.segments.join("--" + sBoundary + "\r\n") + "--" + sBoundary + "--\r\n");

        },
        inputID = 'ajaxUpload-' + (Date.now() + indexEle),
        inputEle,
        url     = self.getAttribute('data-url'),
        form    = document.createElement('form');

    // Add form element into body
    form.style.cssText = '    position: fixed;    left: 0px;    top: 0px;    width: 0;    height: 0;    overflow: hidden;';
    form.innerHTML = '<input id="' + inputID + '" data-url="' + url + '" type="file" name="file" value="" multiple>';
    document.querySelector('body').appendChild(form)
    inputEle = document.getElementById(inputID);


    // Bind current element's click event.
    self.addEventListener('click', function() {

      if (loading === false) {
        inputEle.click();
      } else {
        loading = false;
        xmlHttp.abort();
        alert('已取消上传');
      }

    })

    inputEle.onchange = function() {

      loading = true;

      // self._innerHTML = self.innerHTML;
      // self.innerHTML = '取消上传'

      submitFiles(inputEle, url)

    }

    // alert('Trigger click')
    // Trigger input & alert system file-upload view
    window.inputEle = inputEle;
  }

  // document.addEventListener('click', function(e) {

  //   alert('hi,...')
  //   var target = e.target;
  //   if (target.getAttribute('data-role') === 'ajaxUpload') {

  //     if (target.inited === undefined) {
  //       target.inited = true;
  //       alert('ajaxUpload init')
  //       ajaxUpload(target)
  //       // target.click();
  //     }
  //   }
  // })

  var init = function() {
    var eles = document.querySelectorAll('[data-role=ajaxUpload]');
    for (var i = 0, max = eles.length; i < max; i++) {

      if (!eles[i].inited) {
        eles[i].inited = true;
        ajaxUpload(eles[i], i);
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
