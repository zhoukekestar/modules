var crypto = require('crypto');
var utils =  {
  formatDate: function(d, type) {
    if (d instanceof Date) {

      // 12.25
      if (type === 0){
        return (d.getMonth() + 1) + '.' + d.getDate();

      // 20150225
      } else if (type === 1){
        var month = d.getMonth() + 1;
        month = month > 10 ? month + '' : '0' + month;
        var date = d.getDate();
        date = date > 10 ? date + '' : '0' + date;
        return d.getFullYear() + '' + month + '' + date;

      // 2015-02-25
      } else if (type === 2){
        var month = d.getMonth() + 1;
        month = month > 10 ? month + '' : '0' + month;
        var date = d.getDate();
        date = date > 10 ? date + '' : '0' + date;
        return d.getFullYear() + '-' + month + '-' + date;
      }

      // 2015-5-25
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

    }
    return 'Date-error';
  },
  getYesterdayString: function() {
    var d = new Date();
    d = new Date(d.getTime() - 24 * 60 * 60 * 1000);
    return utils.formatDate(d, 2);
  },
  getYesterdayDate: function() {
    var d = new Date();
    d = new Date(d.getTime() - 24 * 60 * 60 * 1000);
    d = utils.formatDate(d);
    // Fix utc bug
    return new Date(d + ' 00:00:00Z');
  },
  md5: function(str){

    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
  },
  sha1: function(str) {

    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
  },
  hmacSha1: function(signStr, key) {

    var sha = crypto.createHmac('sha1', key);
    sha.update(signStr);

    var buf1 = new Buffer(sha.digest());
    var buf2 = new Buffer(signStr);
    var buf = new Buffer(buf1.length + buf2.length);
    buf1.copy(buf, 0);
    buf2.copy(buf, buf1.length);

    return buf.toString('base64');

  },
  // @see https://github.com/jquery/jquery/blob/bb026fc12c3c2ad37f47f0919e484bddcdc3d291/src/core.js
  extend: function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
      deep = target;

      // Skip the boolean and the target
      target = arguments[ i ] || {};
      i++;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
      target = {};
    }

    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if ( deep && copy && ( jQuery.isPlainObject(copy) ||
            (copyIsArray = jQuery.isArray(copy)) ) ) {

            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = utils.extend( deep, clone, copy );

            // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }
}



module.exports = utils;
