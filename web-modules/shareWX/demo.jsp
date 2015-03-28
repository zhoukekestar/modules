<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="w" tagdir="/WEB-INF/tags/" %>
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<w:shareWX url="" save="share"></w:shareWX>
	<script type="text/javascript" src="http://cdn.bootcss.com/jquery/2.1.3/jquery.min.js"></script>
	<script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
	<script type="text/javascript" src="/web-modules/module/shareWX/shareWX.js"></script>
	<script>
	alert("hi")
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

	</script>
</body>
</html>