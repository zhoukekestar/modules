require.config({
  baseUrl: "../web-modules/",
  paths: {
    jquery: "_lib/jquery.min",

    // NO AMD RULES
    swiper: "_lib/swiper/swiper.min",
    gaodeMap: "_lib/gaodeMap",
    jqueryCookie: "_lib/jquery.cookie.min",
    jqueryLazyload: "_lib/jquery.lazyload.min",
    jweixin: "_lib/jweixin-1.0.0",

    // AMD
    alertMsg: "alertMsg/alertMsg",
    baseUtils: "baseUtils/baseUtils",

    pullDown: 'pull-v2/pullDown',
    pullUp: 'pull-v2/pullUp',
    formValidator: 'H5Form/formValidator',
    formSubmit: 'H5Form/formSubmit',
    shareWX: 'shareWX/shareWX',
    jqueryMobile: '_lib/jquery-mobile/jquery.mobile.custom',
    citySelect: 'citySelect/citySelect',
    popup: 'popup/popup',
    tabs: 'tabs/tabs',
    loadpage: 'loadpage/loadpage',
    loadingPage: 'loadingPage/loadingPage',
  },
  shim: {
    swiper: {
      exports: "Swiper"
    },
    gaodeMap: {
      exports: "AMap"
    },
    jqueryCookie: {
      deps: ["jquery"]
    },
    jqueryLazyload: {
      deps: ["jquery"]
    },
    jweixin: {
      exports: "wx"
    }
  }
});
