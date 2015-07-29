;( function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define(factory );
    } else {
        factory( jQuery );
    }
}( function() {
	$.tools = {
		getParams : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return decodeURI(r[2]);
			return null;
		},
		getStyle : function(obj, attr) {
			if (obj.currentStyle) {
				return obj.currentStyle[attr];
			} else {
				return getComputedStyle(obj, false)[attr];
			}
		},
		getRandomNum : function(Min, Max) {
			var Range = Max - Min;
			var Rand = Math.random();
			return (Min + Math.round(Rand * Range));
		},
		generateMixed : function(n) {
			var chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
					'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
					'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
					'Y', 'Z' ];
			var res = "";
			for (var i = 0; i < n; i++) {
				var id = Math.ceil(Math.random() * 35);
				res += chars[id];
			}
			return res;
		},
    tmpl: function(id, data) {


      var html = document.getElementById(id).innerHTML;

      var code =  "var p = []; with(obj) { " +
        "p.push('" +
        html
          .replace(/[\r\n\t]/g, "")
          // Fix bug like: data-keyword='<%=JSON.stringify(obj)%>'
          // Because ' is key word in this string.
          .replace(/'/g, "\t")
          .replace(/<%=(.*?)%>/g, "'); p.push($1); p.push('")
          .replace(/<%/g, "');")
          .replace(/%>/g, "; p.push('") +
        "');}" +

          // Fix bug
        "return p.join('').replace(/\t/g, \"'\");";
      var fn = new Function('obj', code);
      return fn(data);
    },
    /**
     * @see https://github.com/jquery/jquery-mobile/blob/master/js/navigation/path.js
     * */
    // a-z 0-9 : / @ . ? = & #
    //                   http:             //        jblas           : password       @    mycompany.com                      : 8080             /mail/inbox                        ?msg=1234&type=unread
    //                                                                                                                                                                                         #msg-content
    //                  (http:      )?(  (//  )     (jblas      )    :(password   )   @   (mycompany.com                 )    :(8080  )         (/mail/inbox                    )  (?msg...)  (#..)
    urlParseRE: /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
    parseUrl: function(url) {
      var matches = utils.urlParseRE.exec( url || "" ) || [];

      // Create an object that allows the caller to access the sub-matches
      // by name. Note that IE returns an empty string instead of undefined,
      // like all other browsers do, so we normalize everything so its consistent
      // no matter what browser we're running on.
      return {
        href:         matches[  0 ] || "",
        hrefNoHash:   matches[  1 ] || "",
        hrefNoSearch: matches[  2 ] || "",
        domain:       matches[  3 ] || "",
        protocol:     matches[  4 ] || "",
        doubleSlash:  matches[  5 ] || "",
        authority:    matches[  6 ] || "",
        username:     matches[  8 ] || "",
        password:     matches[  9 ] || "",
        host:         matches[ 10 ] || "",
        hostname:     matches[ 11 ] || "",
        port:         matches[ 12 ] || "",
        pathname:     matches[ 13 ] || "",
        directory:    matches[ 14 ] || "",
        filename:     matches[ 15 ] || "",
        search:       matches[ 16 ] || "",
        hash:         matches[ 17 ] || ""
      };
    }
	};
}));
