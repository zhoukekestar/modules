require.config({
  baseUrl: '../src/',
  paths: {
    jquery        : '_lib/jquery.min',


    swiper        : '_lib/swiper/swiper.min',
    gaodeMap      : '_lib/gaodeMap',
    jqueryCookie  : '_lib/jquery.cookie.min',
    jqueryLazyload: '_lib/jquery.lazyload.min',
    jweixin       : '_lib/jweixin-1.0.0',


    alertMsg      : 'alertMsg/alertMsg.jquery',
    baseUtils     : 'baseUtils/baseUtils',

    pullDown      : 'pull-v2/pullDown',
    pullUp        : 'pull-v2/pullUp',
    formValidator : 'H5Form/formValidator',
    formSubmit    : 'H5Form/formSubmit',
    shareWX       : 'shareWX/shareWX',
    citySelect    : 'citySelect/citySelect',
    popup         : 'popup/popup',
    tabs          : 'tabs/tabs',
    loadpage      : 'loadpage/loadpage',
    loadingPage   : 'loadingPage/loadingPage',
    formJSON      : 'formJSON/jquery.formJSON',
    template      : 'template/jquery.template',
    ajaxUpload    : 'upload/public/jquery.ajaxUpload',
    preview       : 'preview/preview',
    paging        : 'paging/paging'
  },
  shim: {
    swiper: {
      exports: 'Swiper'
    },
    gaodeMap: {
      exports: 'AMap'
    },
    jqueryCookie: {
      deps: ['jquery']
    },
    jqueryLazyload: {
      deps: ['jquery']
    },
    jweixin: {
      exports: 'wx'
    }
  },
  _exclude: {
    alertMsg      : ['jquery'],
    formValidator : ['jquery', 'alertMsg'],
    formSubmit    : ['formValidator'],
    baseUtils     : ['jquery'],
    pullDown      : ['jquery'],
    pullUp        : ['jquery'],

    swiper        : [],
    gaodeMap      : [],
    jqueryCookie  : ['jquery'],
    jqueryLazyload: ['jquery'],

    jweixin       : [],
    shareWX       : ['jquery', 'jweixin'],
    citySelect    : ['jquery'],
    popup         : ['jquery'],
    tabs          : ['jquery'],
    loadpage      : ['jquery', 'alertMsg', 'loadingPage'],
    loadingPage   : [],
    formJSON      : ['jquery'],
    template      : ['jquery'],
    ajaxUpload    : ['jquery'],
    preview       : ['jquery'],
    paging        : ['jquery']
  }
});
