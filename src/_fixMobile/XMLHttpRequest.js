/**
 *
 * WHY?
 * @see  http://caniuse.com/#search=xml
 * Android 4.3- not supporting json as responseType
 *
 * HOW?
 * @see  https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/XMLHttpRequest/polyfill.js
 *
 */

(function(global, NativeXMLHttpRequest) {

  var testTypeJSON = true;

  try {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', '/', true);
    xmlHttp.responseType = 'json';
  } catch (e) {

    testTypeJSON = false;
  }

  if (!testTypeJSON) {


      // <Global>.XMLHttpRequest
    global.XMLHttpRequest = function XMLHttpRequest() {
      var request = this, nativeRequest = request._request = new NativeXMLHttpRequest();

      nativeRequest.onreadystatechange = function () {
        request.readyState = nativeRequest.readyState;

        var readyState = request.readyState === 4;

        request.response = request.responseText = readyState ? nativeRequest.responseText : null;
        request.status = readyState ? nativeRequest.status : null;
        request.statusText = readyState ? nativeRequest.statusText : null;

        // support responseType is json.
        if (request.response && request.responseType === 'json') {
          try {
            request.response = JSON.parse(request.response);
          } catch (e) {}
        }

        // request.dispatchEvent(new Event('readystatechange'));
        request.onreadystatechange && request.onreadystatechange();

        if (readyState) {

          // request.dispatchEvent(new Event('load'));
          request.onload && request.onload();
        }
      };

      if ('onerror' in nativeRequest) {
        nativeRequest.onerror = function () {
          // request.dispatchEvent(new Event('error'));
          request.onerror && request.onerror();
        };
      }
    };

    var XMLHttpRequestPrototype = global.XMLHttpRequest.prototype;

    XMLHttpRequestPrototype.addEventListener = global.addEventListener;
    XMLHttpRequestPrototype.removeEventListener = global.removeEventListener;
    XMLHttpRequestPrototype.dispatchEvent = global.dispatchEvent;

    XMLHttpRequestPrototype.abort = function abort() {
      // return this._request();
      return this._request.abort();
    };

    XMLHttpRequestPrototype.getAllResponseHeaders = function getAllResponseHeaders() {
      return this._request.getAllResponseHeaders();
    };

    XMLHttpRequestPrototype.getResponseHeader = function getResponseHeader(header) {
      return this._request.getResponseHeader(header);
    };

    XMLHttpRequestPrototype.open = function open(method, url) {
      // method, url, async, username, password
      this._request.open(method, url, arguments[2], arguments[3], arguments[4]);
    };

    XMLHttpRequestPrototype.overrideMimeType = function overrideMimeType(mimetype) {
      this._request.overrideMimeType(mimetype);
    };

    XMLHttpRequestPrototype.send = function send() {
      this._request.send(0 in arguments ? arguments[0] : null);
    };

    XMLHttpRequestPrototype.setRequestHeader = function setRequestHeader(header, value) {
      this._request.setRequestHeader(header, value);
    };
  }

})(this, this.XMLHttpRequest);
