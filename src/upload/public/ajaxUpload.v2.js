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
        currentElement    = self,
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

        isImageSizeCorrect = function(oFile, oSegmReq, callback) {
          var maxHeight = +(self.dataset.maxHeight || '1000000')
            , minHeight = +(self.dataset.minHeight || '0')
            , height = +(self.dataset.height || '-1')
            , maxWidth = +(self.dataset.maxWidth || '1000000')
            , minWidth = +(self.dataset.minWidth || '0')
            , width = +(self.dataset.width || '-1')

          // return if there is nothing to do.
          if (maxHeight === 1000000 && minHeight === 0 && height == -1 && maxWidth === 1000000 && minWidth === 0 && width === -1) {
            callback(oFile, oSegmReq)
            return;
          }

          // Load file & convert it to image.
          var reader = new FileReader();
          reader.onload = function(theFile) {
            var image = new Image();
            image.src = theFile.target.result;
            image.onload = function() {

              // Specify height & width
              if (height !== -1 && width !== -1) {
                if (this.height === height && this.width === width) {
                  callback(oFile, oSegmReq);
                } else {
                  if (self.onImageSizeError) {
                    self.onImageSizeError(oFile.name, this.width, this.height);
                  } else {
                    alert(oFile.name + ' 文件尺寸不符合要求');
                  }
                }
              // Specify height & width 's range.
              } else {
                if (this.width >= minWidth && this.width <= maxWidth && this.height >= minHeight && this.height <= maxHeight) {
                  callback(oFile, oSegmReq)
                } else {
                  if (self.onImageSizeError) {
                    self.onImageSizeError(oFile.name, this.width, this.height);
                  } else {
                    alert(oFile.name + ' 文件尺寸不符合要求');
                  }
                }
              }

            };
          }
          reader.readAsDataURL(oFile);
        },


        isFileSizeCorrect = function(oFile) {
          var maxSize = self.dataset.maxSize || '5M'
            , minSize = self.dataset.minSize || '0K'
            , size = oFile.size / 1024; // B --> KB

          maxSize = maxSize.toUpperCase();
          minSize = minSize.toUpperCase();

          if (minSize.indexOf('M') !== -1) {
            minSize = +minSize.substring(0, minSize.length - 1);
            minSize *= 1024; // MB --> KB
          } else {
            minSize = +minSize.substring(0, minSize.length - 1);
          }

          if (maxSize.indexOf('M') !== -1) {
            maxSize = +maxSize.substring(0, maxSize.length - 1);
            maxSize *= 1024; // MB --> KB
          } else {
            maxSize = +maxSize.substring(0, maxSize.length - 1);
          }

          if (size >= minSize && size <= maxSize) {
            return true;
          } else {
            if (self.onFileSizeError) {
              self.onFileSizeError(oFile.name, size, minSize, maxSize);
            } else {
              alert(oFile.name + ' 文件大小不符合要求');
            }
            return false;
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
            if (!isFileSizeCorrect(oFile)) {
              continue;
            }

            isImageSizeCorrect(oFile, oSegmReq, function(oFile, oSegmReq) {

              oSegmReq = new FileReader();
              /* (custom properties:) */
              oSegmReq.segmentIdx = oField.segments.length;
              oSegmReq.owner = oField;
              /* (end of custom properties) */
              oSegmReq.onload = pushSegment;
              oField.segments.push("Content-Disposition: form-data; name=\"" + oField.name + "\"; filename=\""+ oFile.name + "\"\r\nContent-Type: " + oFile.type + "\r\n\r\n");
              oField.status++;
              oSegmReq.readAsBinaryString(oFile);
            })

          }
        },


        // @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Submitting_forms_and_uploading_files
        // Upload form data
        // This function should call by `form` Element so that you can use `this` to get data.
        submitData = function(oData) {

          loading = true;
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
              self.response = response;
              self.xmlHttp = xmlHttp;
              self.dispatchEvent(new Event('ajaxUpload-finished', {bubbles: true}))
            }
          }

          // Send it!
          xmlHttp.sendAsBinary("--" + sBoundary + "\r\n" + oData.segments.join("--" + sBoundary + "\r\n") + "--" + sBoundary + "--\r\n");

        },
        inputID = 'ajaxUpload-' + (Date.now() + indexEle),
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

      submitFiles(inputEle, url)

    }

    return inputEle;
  }


  // Lazy init...
  document.addEventListener('click', function(e) {

    var target = e.target;
    if (target.getAttribute('data-role') === 'ajaxUpload') {

      if (!target.inited) {
        target.inited = true;
        ajaxUpload(target, Date.now()).click();
      }
    }
  })

  // Doc init...
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
