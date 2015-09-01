require.config({
  baseUrl: './src/',
  paths: {
    jquery        : '_lib/jquery.min',


    swiper        : '_lib/swiper/swiper.min',
    gaodeMap      : '_lib/gaodeMap',
    jqueryCookie  : '_lib/jquery.cookie.min',
    jqueryLazyload: '_lib/jquery.lazyload.min',
    jweixin       : '_lib/jweixin-1.0.0',


    alert         : 'alert/alert',
    alertMsg      : 'alertMsg/alertMsg.jquery',

    baseUtils     : 'baseUtils/baseUtils',

    citySelect    : 'citySelect/citySelect',
    confirm       : 'confirm/confirm',

    formJSON      : 'formJSON/jquery.formJSON',
    formValidator : 'H5Form/formValidator',
    formSubmit    : 'H5Form/formSubmit',

    loadpage      : 'loadpage/loadpage',
    loadingPage   : 'loadingPage/loadingPage',

    paging        : 'paging/paging',
    popup         : 'popup/popup',
    preview       : 'preview/preview',
    prompt        : 'prompt/prompt',
    pullDown      : 'pull-v2/pullDown',
    pullUp        : 'pull-v2/pullUp',

    shareWX       : 'shareWX/shareWX',

    tabs          : 'tabs/tabs',
    template      : 'template/jquery.template',

    ajaxUpload    : 'upload/public/ajaxUpload'
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

    swiper        : [],
    gaodeMap      : [],
    jqueryCookie  : ['jquery'],
    jqueryLazyload: ['jquery'],
    jweixin       : [],

    alert         : [],
    alertMsg      : ['jquery'],

    baseUtils     : ['jquery'],

    citySelect    : ['jquery'],
    confirm       : [],

    formJSON      : ['jquery'],
    formValidator : ['jquery', 'alertMsg'],
    formSubmit    : ['formValidator'],

    loadpage      : ['jquery', 'alertMsg', 'loadingPage'],
    loadingPage   : [],

    paging        : [],
    popup         : ['jquery'],
    preview       : ['jquery'],
    prompt        : [],
    pullDown      : ['jquery'],
    pullUp        : ['jquery'],

    shareWX       : ['jweixin'],

    tabs          : ['jquery'],
    template      : ['jquery'],

    ajaxUpload    : []
  }
});
