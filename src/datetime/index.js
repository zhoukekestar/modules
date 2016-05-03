(function(){
  var loadScript = function(url, callback) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }

  loadScript('./rome.min.js', function(){

    rome.moment.defineLocale('zh-cn', {
      months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
      monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
      weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
      weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
      weekdaysMin : '日_一_二_三_四_五_六'.split('_')
    });
    rome.moment.locale('zh-cn');

    var datetime = document.querySelectorAll('input[type=datetime-local]');
    for (var i = datetime.length - 1; i >= 0; i--) {
      rome(datetime[i])
      datetime[i].type = 'text';
      datetime[i].value = datetime[i].value.replace('T', ' ');
    }

    var date = document.querySelectorAll('input[type=date]');
    for (var i = date.length - 1; i >= 0; i--) {
      rome(date[i], {time: false});
      date[i].type = 'text';
    }

  })

  // load CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './rome.css';
  document.head.appendChild(link);
})();
