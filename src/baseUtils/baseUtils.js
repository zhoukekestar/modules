;( function( factory ) {
    if ( typeof define === "function" && define.amd ) {
        define([ "jquery" ], factory );
    } else {
        factory( jQuery );
    }
}( function( $ ) {
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
		//倒计时
		//stopWatch: function($codediv, time)
		//{
		//	$codediv.text(time+"秒后重试");
		//	time--;
		//	if(time >= 0){
		//		$codediv.attr("disabled","true");
		//		setTimeout(function(){
		//			$.tools.stopWatch($codediv, time);
		//		},1000);
		//	}else{
		//		$codediv.text("重新获取").removeAttr("disabled");
		//	}
		//},
		//freshImgCode: function ($imgDiv) {
		//  	$imgDiv.html("");
		// 	var d = new Date();
		// 	var s = d.getMilliseconds() + "";
		// 	$imgDiv.html("<img style='height: 32px;width: 110px;' src='" + $base + "user/image?r=" + s+"' />");
		//},
		//checkImgcode: function (code, callback){
		//	var codeOK = false;
		//	$.tools.post({
		//		url:$base + "user/checkimage?code=" + code,
		//		success:function(d){
		//			codeOK = true;
		//		},
		//		last:function(){
		//			if (typeof callback == "function")
		//				callback(codeOK);
		//		}
		//	});
		//},
    getFormJSON: function(ele) {
      if (ele.jquery === undefined)
        ele = $(ele);
      var arr = ele.serializeArray();
      var res = {};
      arr.forEach(function(t){
        res[t.name] = t.value;
      });
      return JSON.stringify(res);
    },
    postJSON: function(url, data, success, error) {

      if (typeof data === 'function') {
        error   = success;
        success = data;
        data    = '';
      }
      $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: url,
        data: data,
        success: success,
        error: error
      });
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
    }
	};
}));
