//
// IE
if (navigator.appName.indexOf("Internet Explorer") !== -1) {

  // IE 8, OK!
  if (navigator.appVersion.indexOf("MSIE 8") !== -1) {
    Element.prototype.addEventListener = function (name, callback) {
      this.attachEvent('on' + name, callback);
    }

  // Test it on IE 7
  // IE 6 ? I don't know.
  } else if (navigator.appVersion.indexOf("MSIE 7") !== -1 || navigator.appVersion.indexOf("MSIE 6") !== -1) {

    var _getElementById = document.getElementById;
    document.getElementById = function(str) {
      var ele = _getElementById(str);
      ele.addEventListener = function(name, callback) {
        this.attachEvent('on' + name, callback);
      }
      return ele;
    }

    // document.getElementsByClassName
    // document.getElementsByName
    // document.getElementsByTagName
    // document.getElementsByTagNameNS
    //
    //
    // var _getElementsByTagName = document.getElementsByTagName;
    // document.getElementsByTagName = function(str) {
    //   var eles = _getElementsByTagName(str);
    //   var ele;
    //   for (ele in eles) {
    //    ele.addEventListener = function(name, callback) {
    //      this.attachEvent('on' + name, callback);
    //    }
    //   }
    //   return eles;
    // }
    //
  }

}
