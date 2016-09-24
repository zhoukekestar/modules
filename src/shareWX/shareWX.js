(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jweixin" ], factory);
  } else {
    factory(wx);
  }
}(function(wx) {

  var options = {

    /**
     *
     * Sign url api ( You can use [wechat.js](https://github.com/zhoukekestar/modules-nodejs/blob/master/lib/wechat.js) to response the request. ) :
     *
     * Example:
     * Request: /wechat/sdk/sign?url=http%3A%2F%2F223.95.81.53%3A23002%2Fshop%2Fevent%2F1
     * Response: {"url":"http://223.95.81.53:23002/shop/event/1","appId":"wx7d7b73a6b545f4d4","timestamp":1438830027313,"nonceStr":"2265","signature":"3f0a4edbd91d814faaf6f99b785d88e2ecaf98e8"}
     *
     */
    api       : '',
    debug     : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。

    // Url config
    appId     : '', // 必填，公众号的唯一标识
    timestamp : 0 , // 必填，生成签名的时间戳
    nonceStr  : '', // 必填，生成签名的随机串
    signature : '', // 必填，签名，见附录1

    // Share config
    title   : "",
    desc    : "",
    link    : "",
    imgUrl  : "",
    success : function() {},
    cancel  : function() {},

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
      'openCard'
    ]
  }


  var shareWX = function(o) {

    for (var key in o) { options[key] = o[key]; }

    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", options.api + '?url=' + encodeURIComponent(location.href.split('#')[0]), true);
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
        var d = JSON.parse(xmlHttp.responseText);

        for (var key in d) { options[key] = d[key] }

        wx.config(options);

        wx.ready(function() {

          if (options.hide) {

            wx.hideOptionMenu();
          }

          share(wx, options);
        })
      }
    }
    xmlHttp.send(null);
  };


  function share(wx, options) {

    wx.onMenuShareTimeline({
      title: options.title, // 分享标题
      link: options.link, // 分享链接
      imgUrl: options.imgUrl, // 分享图标
      success: options.success,
      cancel: options.cancel
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
  }

  var tryCount = 0;
  var init = function(force) {

    // WeixinJSBridge should be loaded before init function.
    if (!window.WeixinJSBridge) {
      if (tryCount > 100) {
        return;
      }
      setTimeout(function() {
        init();
        tryCount++;
        // console.log('WeixinJSBridge not defined, retry.')
      }, 300)
      return;
    }

    var namespace = '_';
    var role = document.querySelector('[data-role=shareWX]');

    if (role && (!role[namespace + 'inited'] || force)) {
      role[namespace + 'inited'] = true;

      var data = {
        api: role.getAttribute('data-api') || '/wechat/sdk/sign',
        hide: !!role.getAttribute('data-hide'),
        title: role.getAttribute('data-title') || document.title,
        desc: role.getAttribute('data-desc') || location.href,
        link: role.getAttribute('data-link') || location.href,
        imgUrl: role.getAttribute('data-imgUrl'),
        debug: !!role.getAttribute('data-debug'),
        success: role[namespace + 'success'],
        cancel: role[namespace + 'cancel']
      }

      shareWX(data)

      role[namespace + 'wx'] = wx;
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

  document.addEventListener('reload', function() {
    init(true);
  })

  document.addEventListener('shareWX-reload', function() {
    init(true)
  })

}));
