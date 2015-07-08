;( function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define([ "jquery", "jweixin" ], factory );
	} else {
		factory( jQuery, wx );
	}
}( function($, wx){
	$.shareWXConfig = function(options){

    if (options !== undefined) {
      options = $.extend({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: 0, // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'onMenuShareWeibo',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
          'translateVoice',
          'startRecord',
          'stopRecord',
          'onRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getNetworkType',
          'openLocation',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow',
          'scanQRCode',
          'chooseWXPay',
          'openProductSpecificView',
          'addCard',
          'chooseCard',
          'openCard']
      }, options);


      wx.config(options);
    }

    var returnObj = {
      then: function(callback){
        wx.ready(function(){
          callback();
        });
      }
    }
    return returnObj;
	};

	$.shareWX = function(options){

		options = $.extend({
			title: "",
			desc: "",
			link:"",
			imgUrl:"",
			success:function(){},
			cancel:function(){}

		},options);

		wx.onMenuShareTimeline({
		    title: options.title, // 分享标题
		    link: options.link, // 分享链接
		    imgUrl: options.imgUrl, // 分享图标
		    success: options.success,
		    cancel: options.cancel,
		});

		wx.onMenuShareAppMessage({
		    title: options.title, // 分享标题
		    desc: options.desc, // 分享描述
		    link: options.link, // 分享链接
		    imgUrl: options.imgUrl, // 分享图标
		    success: options.success,
		    cancel: options.cancel
		});
		wx.onMenuShareQQ({
			title: options.title, // 分享标题
		    desc: options.desc, // 分享描述
		    link: options.link, // 分享链接
		    imgUrl: options.imgUrl, // 分享图标
		    success: options.success,
		    cancel: options.cancel
		});
		wx.onMenuShareWeibo({
			title: options.title, // 分享标题
		    desc: options.desc, // 分享描述
		    link: options.link, // 分享链接
		    imgUrl: options.imgUrl, // 分享图标
		    success: options.success,
		    cancel: options.cancel
		});
	};

  $.jweixin = wx;
	return $;
}));
