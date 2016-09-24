require.config({
  baseUrl: '../',
  paths: {
    jquery: 'http://cdn.bootcss.com/jquery/2.1.3/jquery.min',
    alertMsg: 'alertMsg/alertMsg.jquery',
    loadingPage: 'loadingPage/loadingPage',
    loadpage: 'loadpage/loadpage'
  }
});

require(['loadingPage','jquery', 'loadpage'], function (l, $, load) {
  l.loaded();

  load.afterLoadPage = function() {
    console.log('after')
  }
  load.beforeLoadPage = function() {
    console.log('before')
  }
});
