<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="w" tagdir="/WEB-INF/tags/" %>
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<w:shareWX url="" save="share"></w:shareWX>
	<script src="//cdn.bootcss.com/require.js/2.1.15/require.min.js"></script>
	<script>
	$ws="${ws}",$base="${base}";
	require.config({
		baseUrl: $base,
		paths: {
			jquery: 'http://cdn.bootcss.com/jquery/2.1.3/jquery.min',
			swiper: "http://www.idangero.us/swiper/dist/js/swiper.min",
			bootstrap: "http://cdn.bootcss.com/bootstrap/3.3.2/js/bootstrap.min",
			alertMsg: "module/alertMsg/alertMsg",
			pullDown: 'module/pull/pull',
			pullUp: 'module/pull/pull',
			formValidator: 'module/H5Form/formValidator',
			formSubmit: "module/H5Form/formSubmit",
			jweixin: "http://res.wx.qq.com/open/js/jweixin-1.0.0",
			shareWX: "module/shareWX/shareWX"
		},
		shim: {
			swiper: {
				exports: "Swiper"
			},
			bootstrap:{
				deps: ['jquery']
			},
			jweixin: {
				exports: "wx"
			}

		},
		waitSeconds: 15
	});

	require(["shareWX"], function(shareWX){
		/*var $ = shareWX.$;
		var wx = shareWX.wx;

		var o = $.extend($.parseJSON('${share}'), {
			success: function(){
				wx.getLocation({
		    	    success: function (res) {
		    	        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
		    	        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
		    	        var speed = res.speed; // 速度，以米/每秒计
		    	        var accuracy = res.accuracy; // 位置精度
		    	        alert(latitude);
		    	        alert(longitude);
		    	    }
		    	});
			}
		});

		$.shareWXConfig(o);
		*/

    $.shareWXConfig().then(function(){

    });
	});
	</script>
</body>
</html>
