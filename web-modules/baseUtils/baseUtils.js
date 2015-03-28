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
				return unescape(r[2]);
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
		stopWatch: function($codediv, time)
		{
			$codediv.text(time+"秒后重试");
			time--;
			if(time >= 0){
				$codediv.attr("disabled","true");
				setTimeout(function(){
					$.tools.stopWatch($codediv, time);
				},1000);
			}else{
				$codediv.text("重新获取").removeAttr("disabled");
			}
		},
		checkCode: function (code, cellphone, type, callback) {
			var v = code;
			var ok = false;
			if (v.length == 0)
			{
				return;	
			}
			if (v.length != 6)
			{
				$.alertMsg("验证码格式错误");
				return;
			}
			$.tools.req({
				method:"put",
				url:$base + "user/checkverifycode?cellphone="+cellphone+"&authcode=" + code + "&type=" + type,
				success: function(d) {
					$.alertMsg("校验成功");
					ok = true;
				},
				last:function()
				{
					if (typeof callback == "function")
						callback(ok);
				}
			});
		},
		getCode: function (cellphone, $getCodeBtn, type, callback)
		{
			$.tools.get({
				url:$base + "user/requestverifycode?cellphone="+ cellphone + "&type=" + type, 
				success:function(d) {
					$.alertMsg("短信已发送，请注意查收");
					$.tools.stopWatch($getCodeBtn, 60);
				},
				error:function(){
					$.alertMsg("网络错误");
				},
				last:function(){
					if (typeof callback == "function")
						callback();
				}
			});
		},
		freshImgCode: function ($imgDiv) {
		  	$imgDiv.html("");
		 	var d = new Date();
		 	var s = d.getMilliseconds() + "";
		 	$imgDiv.html("<img style='height: 32px;width: 110px;' src='" + $base + "user/image?r=" + s+"' />");
		},
		checkImgcode: function (code, callback){
			var codeOK = false;
			$.tools.post({
				url:$base + "user/checkimage?code=" + code,
				success:function(d){
					codeOK = true;
				},
				last:function(){
					if (typeof callback == "function")
						callback(codeOK);
				}
			});
		}
	};
}));